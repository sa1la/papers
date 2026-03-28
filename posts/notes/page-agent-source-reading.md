---
date: 2026-03-22 19:45:39 +08:00
title: 理解page-agent设计（一）
category: "notes"
tags: [page-agent, 源码阅读]
outline: "deep"
---

### 入口与模块划分

page-agent有多个包，每个包负责独立的任务，但又相互关联。

入口是page-agent包，它继承了PageAgentCore后，在构造器中初始化了panel和page-controller，使得Agent任务状态和动作能实时更新到UI。

模块有这些package：

- page-agent：负责初始化PageAgent，把 PageController 和 Panel 装配进来。
- core（核心）：执行任务的主体。调用 llms 和 page-controller，通过事件向外广播状态变化（如 UI）；core 不直接依赖 UI，靠事件解耦。
- page-controller：负责根据core的需要，搜集页面信息，对页面进行操作等
- llms：负责和大模型交互
- ui：负责在页面展示page-agent控件
- 其他包：基于这些包提供能力

我读代码主要先读了page-agent+core+llms

### 关键流程

核心流程在 PageAgentCore.execute()里，遵循了ReAct模式：每一步都是"观察、思考、行动"的循环。

```ts
// 类型来自 @page-agent/core 和 @page-agent/llms

// ===== 来自 packages/core/src/types.ts =====

interface AgentReflection {
  evaluation_previous_goal: string
  memory: string
  next_goal: string
}

interface MacroToolInput extends Partial<AgentReflection> {
  action: Record<string, any>
}

interface MacroToolResult {
  input: MacroToolInput
  output: string
}

interface AgentStepEvent {
  type: 'step'
  stepIndex: number
  reflection: Partial<AgentReflection>
  action: {
    name: string
    input: any
    output: string
  }
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

interface ObservationEvent {
  type: 'observation'
  content: string
}

interface RetryEvent {
  type: 'retry'
  message: string
  attempt: number
  maxAttempts: number
}

interface AgentErrorEvent {
  type: 'error'
  message: string
}

type HistoricalEvent
  = | AgentStepEvent
    | ObservationEvent
    | RetryEvent
    | AgentErrorEvent

interface ExecutionResult {
  success: boolean
  data: string
  history: HistoricalEvent[]
}

type AgentStatus = 'idle' | 'running' | 'completed' | 'error'

type AgentActivity
  = | { type: 'thinking' }
    | { type: 'executing', tool: string, input: unknown }
    | { type: 'retrying', attempt: number, maxAttempts: number }
    | { type: 'error', message: string }

// ===== 来自 packages/llms/src/types.ts =====

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content?: string | null
}

interface InvokeResult<TResult = unknown> {
  toolCall: {
    name: string
    args: any
  }
  toolResult: TResult
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

interface LLMClient {
  invoke: (
    messages: Message[],
    tools: Record<string, any>,
    abortSignal?: AbortSignal,
    options?: { toolChoiceName?: string, normalizeResponse?: (res: any) => any }
  ) => Promise<InvokeResult>
}

// ===== 简化示例：PageAgentCore.execute 核心逻辑 =====

class PageAgentCore {
  private history: HistoricalEvent[] = []
  private step = 0
  private config = { maxSteps: 40, stepDelay: 0.4 }
  private #llm!: LLMClient
  private #states = {
    browserState: null as { url: string, content: string } | null,
    totalWaitTime: 0,
    lastURL: '',
  }

  // 生命周期钩子（由 config 传入）
  onBeforeTask?: (agent: PageAgentCore) => Promise<void> | void
  onBeforeStep?: (agent: PageAgentCore, step: number) => Promise<void> | void
  onAfterStep?: (agent: PageAgentCore, history: HistoricalEvent[]) => Promise<void> | void
  onAfterTask?: (agent: PageAgentCore, result: ExecutionResult) => Promise<void> | void

  async execute(task: string): Promise<ExecutionResult> {
    // 启动：触发钩子、显示遮罩、清空 history
    await this.onBeforeTask?.(this)
    this.history = []
    this.#setStatus('running')
    this.step = 0

    while (true) {
      try {
        await this.onBeforeStep?.(this, this.step)

        // 1. Observe：采集页面快照（DOM、URL、可见元素）
        this.#states.browserState = await this.#getBrowserState()
        await this.#handleObservations(this.step)

        // 2. Think：系统提示词 + history + 观测 → 调用 LLM
        const messages: Message[] = [
          { role: 'system', content: this.#getSystemPrompt() },
          { role: 'user', content: await this.#assembleUserPrompt() },
        ]
        this.#emitActivity({ type: 'thinking' }) // 瞬态，只给 UI 用
        const result = await this.#llm.invoke(
          messages,
          { AgentOutput: this.#packMacroTool() },
          undefined,
          { toolChoiceName: 'AgentOutput' }
        )

        // 3. Act：解析动作，写入 history（持久，下一步会进 LLM 上下文）
        const macroResult = result.toolResult as MacroToolResult
        const actionName = Object.keys(macroResult.input.action)[0]

        this.history.push({
          type: 'step',
          stepIndex: this.step,
          reflection: {
            evaluation_previous_goal: macroResult.input.evaluation_previous_goal,
            memory: macroResult.input.memory,
            next_goal: macroResult.input.next_goal,
          },
          action: {
            name: actionName,
            input: macroResult.input.action[actionName],
            output: macroResult.output,
          },
          usage: result.usage,
        } as AgentStepEvent)
        this.#emitHistoryChange()

        await this.onAfterStep?.(this, this.history)

        // 终止 1：LLM 返回 done
        if (actionName === 'done') {
          const success = macroResult.input.action.done?.success ?? false
          const text = macroResult.input.action.done?.text || 'no text provided'
          const executionResult: ExecutionResult = { success, data: text, history: this.history }
          await this.onAfterTask?.(this, executionResult)
          return executionResult
        }
      }
      catch (error) {
        // 终止 2：异常（含 stop 触发的 AbortError）
        const executionResult: ExecutionResult = {
          success: false,
          data: error instanceof Error ? error.message : String(error),
          history: this.history,
        }
        await this.onAfterTask?.(this, executionResult)
        return executionResult
      }

      // 终止 3：超过 maxSteps（默认 40）
      if (++this.step > this.config.maxSteps) {
        const executionResult: ExecutionResult = {
          success: false,
          data: 'Step count exceeded maximum limit',
          history: this.history,
        }
        await this.onAfterTask?.(this, executionResult)
        return executionResult
      }

      await this.#waitFor(this.config.stepDelay)
    }
  }

  // 辅助方法占位
  #setStatus(_status: AgentStatus): void { /* ... */ }
  #getBrowserState(): Promise<{ url: string, content: string }> {
    return Promise.resolve({ url: '', content: '' })
  }

  #handleObservations(_step: number): Promise<void> { return Promise.resolve() }
  #getSystemPrompt(): string { return '' }
  #assembleUserPrompt(): Promise<string> { return Promise.resolve('') }
  #emitActivity(_activity: AgentActivity): void { /* ... */ }
  #packMacroTool(): any { return {} }
  #emitHistoryChange(): void { /* ... */ }
  #waitFor(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
  }
}
```

流程中有两套并行信息流

- history（持久）：每步的 reflection + action 写入this.history，下一步会被带入 LLM 上下文，是 Agent 的记忆。
- activity（瞬态）：emitActivity() 只给 UI 实时反馈用（"思考中…"、"重试中…"），不存储，不影响模型行为。

### Core 的事件通知方式

PageAgentCore继承了EventTarget，可以通过dispatchEvent来通知依赖方，现有事件有：statuschange、historychange、activity、dispose。

Core也监听llms的通知事件，会记录重试（retry）和异常（error）到history，并将状态切换为 retrying 或 `error`。

在开发其他流程时也可以参考这个设计，history用来存储对话和任务记录，activity来更新当前状态

### LLM 层的设计

invoke 接受四个参数：

- `messages`：对话历史
- `tools`：暴露给大模型的工具集
- `abortSignal`：中断信号，贯穿 ui → core → llm 三层
- `options`：可指定模型必须调用的特定 tool

LLM 层只管"一次调用的可靠性"，循环、历史、意图判断全部留给 core。每次 invoke 的流程是：发请求 → 拿工具调用结果 → 校验参数 → 执行工具 → 返回

使用重试机制（withRetry）

并非所有错误都会重试，分两类：

- **可重试**：网络错误、限流（429）、服务端错误（5xx）、模型没有调用工具、工具参数格式不对
- **不可重试**：认证失败（401/403）、上下文超长、内容被过滤、用户主动 abort

值得注意的是 INVALID_TOOL_ARGS 和 NO_TOOL_CALL 也是可重试的——模型输出格式不对时，系统会自动重试，让模型重新生成，不需要 prompt 来保证格式正确性。

LLM里使用OpenAIClient，看起来像是调包，但实际上是直接通过fetch来请求，看起来很轻便，该有的都有，可以用来直接用。

整个page-agent库对外部库的依赖很少，用的zod来规范交互数据，我平常用的不多，可以参考一下。

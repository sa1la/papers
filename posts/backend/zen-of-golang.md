---
title: "Go语言之禅"
date: 2023-10-30T10:54:49+08:00
outline: "deep"
tags: ["backend", "golang"]
category: backend
draft: false
---

- **Each package fulfills a single purpose**

  每个包只做一件事

  **A well designed Go package provides a single idea, a set of related behaviours. A good Go package starts by choosing a good name. Think of your package’s name as an elevator pitch to describe what it provides, using just one word.**

  **一个设计良好的Go包提供一个单一的概念，一组相关的功能。好的Go包从选择一个好名字开始。把包名想象成电梯演讲，用一个词来概括它提供的功能。**

  ***

- **Handle errors explicitly**

  显式处理错误

  Robust programs are composed from pieces that handle the failure cases before they pat themselves on the back. The verbosity of `if err != nil { return err }` is outweighed by the value of deliberately handling each failure condition at the point at which they occur. Panic and recover are not exceptions, they aren’t intended to be used that way.

  健壮的程序由那些在自我满足前先处理失败情况的代码组成。虽然`if err != nil { return err }`看起来很啰嗦，但在错误发生点直接处理每个失败情况的价值远大于这种啰嗦。panic和recover不是异常处理机制，它们不应该被当作异常使用。

  ***

- **Return early rather than nesting deeply**

  提前返回而非深度嵌套

  Every time you indent you add another precondition to the programmer’s stack consuming one of the 7 ±2 slots in their short term memory. Avoid control flow that requires deep indentation. Rather than nesting deeply, keep the success path to the left using guard clauses.

  每次代码缩进，都会在程序员的思维栈中增加一个前提条件，消耗短期记忆中有限的7±2个位置之一。避免需要深度缩进的控制流。与其深度嵌套，不如使用卫语句（guard clauses）保持成功路径靠左对齐。

- **Leave concurrency to the caller**

  并发决定权留给调用者

  Let the caller choose if they want to run your library or function asynchronously, don’t force it on them. If your library uses concurrency it should do so transparently.

  让调用者自己决定是否要异步运行你的库或函数，不要强加给他们。如果你的库使用了并发，应该对调用者透明。

  ***

- **Before you launch a goroutine, know when it will stop**

  启动goroutine前，先确定它何时结束

  Goroutines own resources; locks, variables, memory, etc. The sure fire way to free those resources is to stop the owning goroutine.

  goroutine会占用资源：锁、变量、内存等。释放这些资源的可靠方法是停止对应的goroutine。

  ***

- **Avoid package level state**

  避免包级别的状态

  Seek to be explicit, reduce coupling, and spooky action at a distance by providing the dependencies a type needs as fields on that type rather than using package variables.

  尽量明确依赖关系，减少耦合和"远距离的神秘影响"，方法是将类型需要的依赖作为该类型的字段提供，而不是使用包变量。

  ***

- **Simplicity matters**

  简单很重要

  Simplicity is not a synonym for unsophisticated. Simple doesn’t mean crude, it means _readable_ and _maintainable_. When it is possible to choose, defer to the simpler solution.

  简单并不意味着粗糙或不够精致。简单是指代码具有良好的可读性和可维护性。在有选择的情况下，优先选择更简单的解决方案。

  ***

- **Write tests to lock in the behaviour of your package's API**

  编写测试来确保包API行为的稳定性

  Test first or test later, if you shoot for 100% test coverage or are happy with less, regardless your package’s API is your contract with its users. Tests are the guarantees that those contracts are written in. Make sure you test for the behaviour that users can observe and rely on.

  无论你是先写测试还是后写测试，无论你追求100%测试覆盖率还是接受较低的覆盖率，你的包API都是与用户的契约。测试就是这些契约的保障。确保你测试的是用户可以观察到并依赖的行为。

  ***

- **If you think it's slow, first prove it with a benchmark**

  如果你认为代码很慢，先用基准测试证明

  So many crimes against maintainability are committed in the name of performance. Optimisation tears down abstractions, exposes internals, and couples tightly. If you’re choosing to shoulder that cost, ensure it is done for good reason.

  很多损害代码可维护性的行为都是以性能优化的名义进行的。优化往往会破坏抽象，暴露内部实现，增加耦合。如果你决定承担这些代价，请确保有充分的理由。

  ***

- **Moderation is a virtue**

  适度是一种美德

  Use goroutines, channels, locks, interfaces, embedding, in moderation.

  适度使用goroutine、channel、锁、接口和嵌入等特性。

  ***

- **Maintainability counts**

  可维护性很重要

  Clarity, readability, simplicity, are all aspects of maintainability. Can the thing you worked hard to build be maintained after you’re gone? What can you do today to make it easier for those that come after you?

  清晰、可读、简单，这些都是可维护性的不同方面。你辛苦构建的系统在你离开后还能被维护吗？今天你能做些什么，让后来的人更容易接手你的工作？

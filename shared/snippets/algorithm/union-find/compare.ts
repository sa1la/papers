// 并查集性能对比：naive vs. 路径压缩 + 按秩合并

interface UnionFind {
  find: (x: number) => number
  union: (x: number, y: number) => void
}

function makeNaive(n: number): UnionFind {
  const parent = Array.from({ length: n }, (_, i) => i)
  function find(x: number): number {
    while (parent[x] !== x) x = parent[x]
    return x
  }
  function union(x: number, y: number): void {
    parent[find(x)] = find(y)
  }
  return { find, union }
}

function makeOptimized(n: number): UnionFind {
  const parent = Array.from({ length: n }, (_, i) => i)
  const rank = Array.from({ length: n }).fill(0) as number[]
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]] // path halving
      x = parent[x]
    }
    return x
  }
  function union(x: number, y: number): void {
    const px = find(x)
    const py = find(y)
    if (px === py)
      return
    if (rank[px] < rank[py]) {
      parent[px] = py
    }
    else if (rank[px] > rank[py]) {
      parent[py] = px
    }
    else {
      parent[py] = px
      rank[px]++
    }
  }
  return { find, union }
}

// 简单 LCG 伪随机，保证两次跑相同操作序列
function createRng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 0x100000000)
}

function runBenchmark(
  uf: UnionFind,
  n: number,
  ops: { type: 'union' | 'find', x: number, y?: number }[],
): number {
  const start = performance.now()
  for (const op of ops) {
    if (op.type === 'union')
      uf.union(op.x, op.y!)
    else
      uf.find(op.x)
  }
  return performance.now() - start
}

const N = 50_000
const OP_COUNT = 200_000
const rng = createRng(42)
const ops: { type: 'union' | 'find', x: number, y?: number }[] = []
for (let i = 0; i < OP_COUNT; i++) {
  const type = rng() < 0.3 ? 'union' : 'find'
  const x = (rng() * N) | 0
  const y = (rng() * N) | 0
  ops.push(type === 'union' ? { type: 'union', x, y } : { type: 'find', x })
}

const naiveTime = runBenchmark(makeNaive(N), N, ops)
const optimizedTime = runBenchmark(makeOptimized(N), N, ops)

// 输出性能对比结果（使用 warn 以便在控制台可见）
// 示例输出：
//   n=50,000, 200,000 次操作
//   naive:     1409.34 ms
//   optimized: 5.17 ms
//   加速比:    272.74x
console.warn(`n=${N.toLocaleString()}, ${OP_COUNT.toLocaleString()} 次操作`)
console.warn(`naive:     ${naiveTime.toFixed(2)} ms`)
console.warn(`optimized: ${optimizedTime.toFixed(2)} ms`)
console.warn(`加速比:    ${(naiveTime / optimizedTime).toFixed(2)}x`)

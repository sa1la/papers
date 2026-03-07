// --- demo:hide:start ---
import { bench } from '../../../shared/bench.js'
// --- demo:hide:end ---
// 并查集性能对比：naive vs. 路径压缩 + 按秩合并
function makeNaive(n) {
  const parent = Array.from({ length: n }, (_, i) => i)
  function find(x) {
    while (parent[x] !== x) x = parent[x]
    return x
  }
  function union(x, y) {
    parent[find(x)] = find(y)
  }
  return { find, union }
}

function makeOptimized(n) {
  const parent = Array.from({ length: n }, (_, i) => i)
  const rank = Array.from({ length: n }).fill(0)
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]] // path halving
      x = parent[x]
    }
    return x
  }
  function union(x, y) {
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

const N = 10000
const OPS = 50000

bench('naive union-find', () => {
  const uf = makeNaive(N)
  for (let i = 0; i < OPS; i++) {
    uf.union(Math.floor(Math.random() * N), Math.floor(Math.random() * N))
  }
}, 10)

bench('optimized union-find', () => {
  const uf = makeOptimized(N)
  for (let i = 0; i < OPS; i++) {
    uf.union(Math.floor(Math.random() * N), Math.floor(Math.random() * N))
  }
}, 10)

console.log('done. n =', N, ', ops per run =', OPS)

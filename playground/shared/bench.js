// Shared benchmark utility for playground
// Usage: import { bench } from '../shared/bench.js'

/**
 * Run a benchmark function multiple times and report average time
 * @param {string} name - Benchmark name
 * @param {() => void} fn - Function to benchmark
 * @param {number} runs - Number of runs (default: 10)
 */
export function bench(name, fn, runs = 10) {
  const times = []
  for (let i = 0; i < runs; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }
  const avg = times.reduce((a, b) => a + b, 0) / runs
  const min = Math.min(...times)
  const max = Math.max(...times)
  console.log(`${name}: ${avg.toFixed(2)}ms (min: ${min.toFixed(2)}ms, max: ${max.toFixed(2)}ms) × ${runs}`)
}

// Also provide as global for browser/playground compatibility
if (typeof globalThis !== 'undefined' && !globalThis.bench) {
  globalThis.bench = bench
}

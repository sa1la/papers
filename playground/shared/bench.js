// Shared benchmark utility for playground
// Usage: import { bench } from '../shared/bench.js'

/**
 * Run a benchmark function multiple times and report average time
 * @param {string} label - Benchmark name
 * @param {() => void} fn - Function to benchmark
 * @param {number} n - Number of runs (default: 10)
 */
export function bench(label, fn, n = 10) {
  const times = []
  for (let i = 0; i < n; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)
  // Output format matches playground sandbox: "label: avg.ms (min: min.ms, max: max.ms) × n"
  console.log(`${label}: ${avg.toFixed(2)}ms (min: ${min.toFixed(2)}ms, max: ${max.toFixed(2)}ms) × ${n}`)
}

// Also provide as global for browser/playground compatibility
if (typeof globalThis !== 'undefined' && !globalThis.bench) {
  globalThis.bench = bench
}

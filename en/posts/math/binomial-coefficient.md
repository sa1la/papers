---
title: "Binomial Coefficient"
date: 2024-01-31T10:44:17+08:00
outline: "deep"
tags: ["math"]
category: math
translationKey: binomial-coefficient
draft: false
---

While practicing dynamic programming problems, I ran into one that can also be solved with a neat math trick, so I wrote this note down.

The problem is [LeetCode 62: Unique Paths](https://leetcode.cn/problems/unique-paths/description/). You need to compute how many paths there are from the top-left corner to the bottom-right corner of an `m * n` grid. The usual solution is dynamic programming: start from the first cell, compute how many paths reach it, and keep pushing that count forward. This problem can also be solved mathematically with binomial coefficients.

### Concept and Online Tools

[What binomial coefficients are](https://zhuanlan.zhihu.com/p/37314812)

[Binomial coefficient calculator](https://zhuanlan.zhihu.com/p/37314812)

### Solution with Binomial Coefficients

```go
// binom 计算二项式系数，即从n个元素中不重复地选择k个元素的方式数。
func binom(n int, k int) int {
    if k == 0 {
        // 递归的基础情况：C(n, 0) 总是等于 1。
        return 1
    }
    // 递归情况：基于前一个值（将 k 减 1）来计算，并根据选择第 k 个元素的方式数进行调整。
    return (n - k + 1) * binom(n, k-1) / k
}

// uniquePaths 计算从 m x n 网格的左上角到右下角的唯一路径数，
// 限制条件是你只能向下或向右移动。
func uniquePaths(m int, n int) int {
    // 需要的总移动次数是向下 (m-1) 次和向右 (n-1) 次，总共 (m+n-2) 次移动。
    // 我们使用 binom 函数来计算这些移动组合的唯一方式数。
    // 使用 min(m-1, n-1) 来优化计算，利用组合数的性质 C(n, k) = C(n, n-k)。
    return binom(m+n-2, min(m-1, n-1))
}
```

### Standard Dynamic Programming Solution

```go
func uniquePaths(m int, n int) int {
    // 初始化动态规划数组
    dp := make([]int, n)
    // 将数组的每个元素初始化为1
    for i := 0; i < n; i++ {
			dp[i] = 1
    }
    // 从第二行开始，计算每个格子的路径数
    for i := 1; i < m; i++ {
        // 从第二列开始，计算每个格子的路径数
        for j := 1; j < n; j++ {
            // 当前格子的路径数等于上方格子的路径数加左方格子的路径数
            dp[j] += dp[j-1]
        }
    }
    // 返回最后一个格子的路径数
    return dp[n-1]
}
//该算法的时间复杂度为O(m*n)，空间复杂度为O(n)。
```

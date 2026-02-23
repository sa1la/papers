---
title: "Binomial Coefficient"
date: 2024-01-31T10:44:17+08:00
outline: "deep"
tags: ["math"]
category: math
draft: false
---

练习动态规划解题时，碰到一个题可以以很巧妙的数学计算解决，写个文档记录下。

题是[leetcode.62 不同路径](https://leetcode.cn/problems/unique-paths/description/)，要求算出一个 m\*n 的网格中从左上角格子到右下角格子的路径总数。正常解法是动态规划，从第一个格子开始计算有多少个路径，再依次向下计算。这题也可以使用数学的计算方法二项式系数解决.

##### 概念和在线计算工具：

[二项式系数概念](https://zhuanlan.zhihu.com/p/37314812)

[二项式系数计算器](https://zhuanlan.zhihu.com/p/37314812)

##### 二项式系数计算解法：

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

##### 正常动态规划解法：

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

---
title: "Using the Z Function for LeetCode 3029 and 3031"
date: 2024-02-05T21:40:50+08:00
outline: "deep"
tags: ["algorithm", "golang"]
category: algorithm
translationKey: z-function
draft: false
---

## [Z Function (Extended KMP)](https://oi-wiki.org/string/z-func/)

For the definition and core idea, it is easiest to read the explanation on [OI Wiki](https://oi-wiki.org/string/z-func/). Below is a Go implementation of the Z function.

```go
// Z-function
func calculateZFunction(s string) []int {
	length := len(s)
	z := make([]int, length)

	// 初始化两个变量 left 和 right，表示当前 Z 值已经计算出来的区间的左右边界
	left, right := 0, 0

	for i := 1; i < length; i++ {
		// 如果当前字符在已经计算出来的 Z 值区间内，那么可以直接得到它的 Z 值
		if i <= right {
			z[i] = min(right-i+1, z[i-left])
		}
		// 通过比较字符来计算 Z 值
		for i+z[i] < length && s[z[i]] == s[i+z[i]] {
			z[i]++
		}
		// 更新 Z 值已经计算出来的区间的左右边界
		if i+z[i]-1 > right {
			left, right = i, i+z[i]-1
		}
	}
	return z
}

```

Below is code that solves both [3029. Minimum Time to Revert Word to Initial State I](https://leetcode.cn/problems/minimum-time-to-revert-word-to-initial-state-i/) and [3031. Minimum Time to Revert Word to Initial State II](https://leetcode.cn/problems/minimum-time-to-revert-word-to-initial-state-ii/) with one implementation.

```go
func minimumTimeToInitialState(s string, k int) int {
	n := len(s)
	// 初始化 Z 函数数组
	z := make([]int, n)
	l, r := 0, 0
	// 计算 Z 函数
	for i := 1; i < n; i++ {
		// 利用之前计算的结果优化
		if i <= r {
			z[i] = min(r-i+1, z[i-l])
		}
		// 扩展 Z 值
		for i+z[i] < n && s[z[i]] == s[i+z[i]] {
			z[i]++
		}

		// 检查是否找到有效的初始状态
		if i%k == 0 && z[i] >= n-i {
			return i / k
		}

		// 更新 [l, r] 区间
		if i+z[i]-1 > r {
			l, r = i, i+z[i]-1
		}
	}
	// 如果没有找到有效的初始状态，返回最大操作次数
	return (n-1)/k + 1
}
```

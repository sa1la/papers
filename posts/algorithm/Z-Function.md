---
title: "Z Function解决leetcode 3029、3031"
date: 2024-02-05T21:40:50+08:00
outline: "deep"
tags: ["algorithm", "golang"]
category: algorithm
draft: false
---

## [Z 函数（扩展 KMP）](https://oi-wiki.org/string/z-func/)

定义和设计思路直接去[OI](https://oi-wiki.org/string/z-func/)看,以下是 Z 函数的 golang 实现

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

以下是解决[3029. 将单词恢复初始状态所需的最短时间 I](https://leetcode.cn/problems/minimum-time-to-revert-word-to-initial-state-i/)、[3031. 将单词恢复初始状态所需的最短时间 II 困难](https://leetcode.cn/problems/minimum-time-to-revert-word-to-initial-state-ii/)的代码，一份代码解决两个问题

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

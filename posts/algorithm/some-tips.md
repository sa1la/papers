---
date: 2024-12-19 15:47:32 +08:00
title: 矩阵对角线、全排列、数值计算
category: algorithm
outline: "deep"
tags: ["algorithm", "math"]
---

### 矩阵对角线

在一个n x n的二维点阵中，对角线的索引计算方式如下：

对于从左上到右下的主对角线（\）

- 索引公式是：行索引 == 列索引

对于从右上到左下的副对角线（/）

- 索引公式是：行索引 + 列索引 == n - 1

以上公式可以用于从行列坐标中确定点是否在对角线上。

在一个 n x n 的二维点阵中，对角线的索引可以通过以下推导来进行计算：

对于主对角线 从左下到右上（diag1）：

- 在位置 (r, c)，主对角线的索引为 r + c。这个值对于每个特定的主对角线是相同的。例如：
  - (0, 0) 在索引 0
  - (1, 1) 在索引 2
  - (2, 2) 在索引 4
- 所以，利用 diag1[r + c] 可以标示某个主对角线上是否有皇后存在。

对于副对角线 从左上到左下（diag2）：

- 在位置 (r, c)，副对角线的索引可表示为 n - 1 - c + r。通过修改它为 r + (n - 1 - c)，它简化为 r - c + (n - 1)。
  - 例如：
    - (0, 0) 在索引 n - 1
    - (1, 0) 在索引 n - 2
    - (0, n-1) 在索引 0
- 因此，diag2[r - c + (n - 1)] 用于标识某副对角线的使用情况。

通过上述公式，能够在常数时间 O(1) 内确定某一列或斜线是否已被用于放置皇后，从而能有效地解决 N 皇后问题。

### 两种全排列

```go
// 从最小到最大排列的下一个排列
func nextPermutationAscending(target []int) bool {
	n := len(target)
	// 从右向左找到第一个相邻的升序对
	i := n - 2
	for i >= 0 && target[i] >= target[i+1] {
		i--
	}
	if i < 0 {
		return false // 已经是最大排列
	}
	// 从右向左找到第一个大于target[i]的元素
	j := n - 1
	for j > i && target[j] <= target[i] {
		j--
	}
	// 交换这两个元素
	target[i], target[j] = target[j], target[i]
	// 反转i之后的子数组
	for k, l := i+1, n-1; k < l; k, l = k+1, l-1 {
		target[k], target[l] = target[l], target[k]
	}
	return true
}

// 从最大到最小排列的下一个排列
func nextPermutationDescending(target []int) bool {
	n := len(target)
	// 从右向左找到第一个相邻的降序对
	i := n - 2
	for i >= 0 && target[i] <= target[i+1] {
		i--
	}
	if i < 0 {
		return false // 已经是最小排列
	}
	// 从右向左找到第一个小于target[i]的元素
	j := n - 1
	for j > i && target[j] >= target[i] {
		j--
	}
	// 交换这两个元素
	target[i], target[j] = target[j], target[i]
	// 反转i之后的子数组
	for k, l := i+1, n-1; k < l; k, l = k+1, l-1 {
		target[k], target[l] = target[l], target[k]
	}
	return true
}
func SliceUltimate() {
	demoSlice := []int{1, 2, 3}
	fmt.Println(demoSlice)
	for nextPermutationAscending(demoSlice) {
	}
	fmt.Println(demoSlice)
	for nextPermutationDescending(demoSlice) {
	}
	// [1 2 3]
	// true [1 3 2]
	// true [2 1 3]
	// true [2 3 1]
	// true [3 1 2]
	// true [3 2 1]
	// false
	// [3 2 1]
	// true [3 1 2]
	// true [2 3 1]
	// true [2 1 3]
	// true [1 3 2]
	// true [1 2 3]
	// false
}

```

### 数值计算

#### 快速幂

快速幂，二进制取幂（Binary Exponentiation，也称平方法），是一个在O(logn)的时间内计算a^n的小技巧，而暴力的计算需要O(n)的时间。

```go
func modPow(x, n, mod int) int {
	//快速幂计算
	res := 1
	for n > 0 {
		if n&1 == 1 {
			res = res * x % mod
		}
		x = x * x % mod
		n >>= 1
	}
	return res % mod
}
```

详见 https://oi-wiki.org/math/binary-exponentiation/

#### 判断质数

```go
func isPrime(n int) bool {
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}
```

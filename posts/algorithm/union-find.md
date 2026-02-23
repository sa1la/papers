---
title: "Union Find"
date: 2024-01-09T16:50:45+08:00
outline: "deep"
tags: ["algorithm", "golang"]
category: algorithm
draft: false
---

## 并查集

#### 定义

并查集是一种用于管理元素所属集合的数据结构，实现为一个森林，其中每棵树表示一个集合，树中的节点表示对应集合中的元素。

顾名思义，并查集支持两种操作：

- 合并（Union）：合并两个元素所属集合（合并对应的树）
- 查询（Find）：查询某个元素所属集合（查询对应的树的根节点），这可以用于判断两个元素是否属于同一集合

定义来源：https://oi-wiki.org/ds/dsu/ 链接里包含并查集在C++和python的实现，以下为golang实现方式

#### 实现

```go

type UnionFind struct {
	parent []int //根节点记录数组，下标为子节点，值为根节点下标
	size   []int //子集中数量，可以按需设计，比如改成height
}
//初始化并查集
func NewUnionFind(n int) *UnionFind {
	parent := make([]int, n)
	size := make([]int, n)
	for i := 0; i < n; i++ {
		parent[i] = i
		size[i] = 1
	}
	return &UnionFind{parent: parent, size: size}
}
//向并查集放入新关系
func (uf *UnionFind) Union(u, v int) {
	rootX, rootY := uf.Find(u), uf.Find(v)//查找要关联的两个节点的根节点
	if rootX == rootY {
		//一致表明添加过，所以不再重新添加，size也不用更新[^1]
		return
	}
	if uf.size[rootX] < uf.size[rootY] {//不一致并且子节点的根节点大于链接对象根节点的，将该节点的根节点作为共同的根节点，切换关系
		rootX, rootY = rootY, rootX
	}
	uf.parent[rootY] = rootX//绑定链接对象到目标节点的根节点
	uf.size[rootX] += uf.size[rootY] //子集总数合并，特殊场景，其他场景按需设计
}
// 查找i节点的根节点
func (uf *UnionFind) Find(i int) int {
	if uf.parent[i] != i {//存在根节点，递归更新，路径压缩，直接将路径的子节点的父节点指向根节点
		uf.parent[i] = uf.Find(uf.parent[i])
	}
	return uf.parent[i] //返回存储在parent的根节点
}
func (uf *UnionFind) Size(i int) int {
	return uf.size[uf.Find(i)] // 在该场景中，size查询的是节点i所在的子集里节点的总数
}
```

package main

import "fmt"

type UnionFind struct {
	parent []int
	rank   []int
}

func NewUnionFind(n int) *UnionFind {
	parent := make([]int, n)
	rank := make([]int, n)
	for i := range parent {
		parent[i] = i
	}
	return &UnionFind{parent: parent, rank: rank}
}

func (uf *UnionFind) Find(x int) int {
	if uf.parent[x] != x {
		uf.parent[x] = uf.Find(uf.parent[x])
	}
	return uf.parent[x]
}

func (uf *UnionFind) Union(x, y int) bool {
	px, py := uf.Find(x), uf.Find(y)
	if px == py {
		return false
	}
	if uf.rank[px] < uf.rank[py] {
		px, py = py, px
	}
	uf.parent[py] = px
	if uf.rank[px] == uf.rank[py] {
		uf.rank[px]++
	}
	return true
}

func (uf *UnionFind) Connected(x, y int) bool {
	return uf.Find(x) == uf.Find(y)
}

func main() {
	uf := NewUnionFind(6)

	uf.Union(0, 1)
	uf.Union(1, 2)
	uf.Union(3, 4)

	fmt.Println("0 and 2 connected:", uf.Connected(0, 2)) // true
	fmt.Println("0 and 3 connected:", uf.Connected(0, 3)) // false
	fmt.Println("3 and 4 connected:", uf.Connected(3, 4)) // true
	fmt.Println("1 and 5 connected:", uf.Connected(1, 5)) // false

	uf.Union(2, 3)
	fmt.Println("after union(2,3):")
	fmt.Println("0 and 4 connected:", uf.Connected(0, 4)) // true
}

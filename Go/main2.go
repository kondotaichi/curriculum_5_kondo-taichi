package main

import (
	"fmt"
	"strconv"
	"strings"
	"sort"
)

// 文字列を整数の配列に変換する関数
func convertStringToIntArray(m string) []int {
	// 中身を埋める
	strs :=strings.Split(m,",")
	var nums[]int

	for _,str :=range strs{
		num,_:=strconv.Atoi(str)
		nums = append(nums,num)
	}
	return nums
}

// 各整数の出現回数を数える関数
func countNumberFrequency(a []int) map[int]int {
	// 中身を埋める
	frequencyCount := make(map[int]int)
	for _,num :=range a{
		frequencyCount[num]++
	}
	return frequencyCount
}

// 整数の合計をsにする方法が何通りあるかを数える関数
func countCardCombinations(a []int, s int) int {
    n := len(a)
    dp := make([][]int, n+1)
    for i := range dp {
        dp[i] = make([]int, s+1)
    }

    // 初期条件
    dp[0][0] = 1

    // DPテーブルを更新
    for i := 1; i <= n; i++ {
        for j := 0; j <= s; j++ {
            dp[i][j] = dp[i-1][j]
            if j >= a[i-1] {
                dp[i][j] += dp[i-1][j-a[i-1]]
            }
        }
    }
	if dp[n][s] == 0 {
		return -1
	}else {
		return dp[n][s]
	}
}

// map[int]intのkeyとvalueをkeyの昇順に出力する関数
func printMapKeyAndValue(m map[int]int) {
	// mapのキーをスライスに抽出
	keys := make([]int, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	
	// キーを昇順でソート
	sort.Ints(keys)

	// ソートされたキーを使用して、mapの内容を出力
	for _, k := range keys {
		fmt.Printf("%d %d\n", k, m[k])
	}
}

func main() {
	var m string
	var s int

	fmt.Scan(&m)
	fmt.Scan(&s)

	a := convertStringToIntArray(m)
	frequencyCount := countNumberFrequency(a)
	combinationCount := countCardCombinations(a, s)

	printMapKeyAndValue(frequencyCount)
	fmt.Println(combinationCount)
}
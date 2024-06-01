package main

import (
	"fmt"
	"strconv"
)

const fizz, buzz = "Fizz", "Buzz"
const fizzBuzz = fizz + buzz

// 数字の配列で入力、文字列の配列で出力
func FizzBuzz(numbers []int) []string {
	result := make([]string, 0, len(numbers))
	//このresultはスライスの型と容量をしていしているだけで意味を持たない
	for _, n := range numbers {
		switch {
		case isFizz(n):
			result = append(result, fizz)
		case isBuzz(n):
			result = append(result, buzz)
		case isFizzBuzz(n):
			result = append(result, fizzBuzz)
		default:
			result = appendNum(result, n)
		}
	}
	return result
}
func isFizz(n int) bool {
	return (n > 0 && n%3 == 0 && n%5 != 0)
}
func isBuzz(n int) bool {
	return (n > 0 && n%5 == 0 && n%3 != 0)
}
func isFizzBuzz(n int) bool {
	return (n > 0 && n%15 == 0)
}

// 入力されたものごとに型を指定する必要あり
func appendNum(s []string, n int) []string {
	return append(s, strconv.Itoa(n))
	//I to Aは整数を文字列に変換する関数
}
func main() {
	ret := FizzBuzz([]int{0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20})
	fmt.Printf("%v", ret)
	//fmt.Printfは出力する関数
	//fmtは入出力を行うためのパッケージ
}

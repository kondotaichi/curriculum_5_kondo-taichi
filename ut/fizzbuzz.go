// ut/fizzbuzz.go
package fizzbuzz

import "strconv"

// FizzBuzz returns a fizzbuzz string based on the input number
func FizzBuzz(n int) string {
    if n%15 == 0 {
        return "FizzBuzz"
    } else if n%3 == 0 {
        return "Fizz"
    } else if n%5 == 0 {
        return "Buzz"
    }
    return strconv.Itoa(n)
}


// ut/fizzbuzz_test.go
package fizzbuzz

import "testing"

func TestFizzBuzz(t *testing.T) {
    cases := []struct {
        in   int
        want string
    }{
        {1, "1"},
        {2, "2"},
        {3, "Fizz"},
        {4, "4"},
        {5, "Buzz"},
        {15, "FizzBuzz"},
    }

    for _, c := range cases {
        got := FizzBuzz(c.in)
        if got != c.want {
            t.Errorf("FizzBuzz(%d) == %q, want %q", c.in, got, c.want)
        }
    }
}


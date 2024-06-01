package main

import (
	"reflect"
	"testing"
)

func TestFizzBuzz(t *testing.T) {
	type args struct {
		numbers []int
	}
	tests := []struct {
		name string
		args args
		want []string
	}{
		{
			name: "1〜20の値でFizzBuzzテスト",
			args: args{
				numbers: []int{0, -1, -2, -3, -4, -5},
			},
			want: []string{"0", "-1", "-2", "-3", "-4", "-5"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := FizzBuzz(tt.args.numbers); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("FizzBuzz() = %v, want %v", got, tt.want)
			}
		})
	}
}

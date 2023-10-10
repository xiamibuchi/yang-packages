package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
	var x int = 1
	x = 3
	const y = 3
	fmt.Println(x + y)
	if true {
		fmt.Println("True")
	} else {
		fmt.Println("False")
	}
}

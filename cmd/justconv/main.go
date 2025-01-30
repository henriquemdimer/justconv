package main

import (
	"fmt"

	"github.com/henriquemdimer/justconv/pkg/justconv"
)

func main() {
	conv := justconv.New()
	output, err := conv.Convert("testdata/convert-this.jpg", "avif")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(output)
}

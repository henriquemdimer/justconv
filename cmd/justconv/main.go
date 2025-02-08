package main

import (
	"log"
	"sync"

	"github.com/henriquemdimer/justconv/pkg/justconv"
)

// TEMPORARY FILE, TEST ONLY
func main() {
	conv := justconv.New()
	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		conv.Init()
	}()

	for i := 0; i < 10; i++ {
		fm := "webp"
		if i % 2 == 0 {
			fm = "bmp"
		}

		if i % 3 == 0 {
			fm = "png"
		}

		id, err := conv.Convert("testdata/convert-this.jpg", fm)
		if err != nil {
			log.Printf("Failed to convert to %s\n", fm)
		}

		log.Printf("Enqueued task: %s", id)
	}

	wg.Wait()
}

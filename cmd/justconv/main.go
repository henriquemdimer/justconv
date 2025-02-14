package main

import server "github.com/henriquemdimer/justconv/internal/infra"

func main() {
	sv := server.NewServer(nil)
	sv.Init()
}

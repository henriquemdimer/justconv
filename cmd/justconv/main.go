package main

import server "github.com/henriquemdimer/justconv/internal/infra/server"

func main() {
	sv := server.NewServer(nil)
	sv.Init()
}

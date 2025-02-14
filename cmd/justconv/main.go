package main

import server "github.com/henriquemdimer/justconv/internal/infra/server"

func main() {
	sv := server.NewHTTPServer(nil)
	sv.Init()
}

package main

import (
	"github.com/henriquemdimer/justconv/internal/application/handlers"
	"github.com/henriquemdimer/justconv/internal/infra/bus"
	"github.com/henriquemdimer/justconv/internal/infra/cache/inmemory"
	"github.com/henriquemdimer/justconv/internal/infra/server"
	"github.com/henriquemdimer/justconv/pkg/justconv"
)

func main() {
	commandBus := bus.NewDefaultCommandBus()
	eventBus := bus.NewDefaultEventBus()

	conv_cache := inmemory.NewInMemoryConversionListCache(eventBus)
	conversor := justconv.New()

	commandHandler := handlers.NewCommandHandler(eventBus, conv_cache, conversor)
	commandBus.RegisterHandler("CreateUpload", commandHandler.CreateUploadHandler)

	sv := server.NewHTTPServer(commandBus, nil)
	go conversor.Init()
	sv.Init()
}

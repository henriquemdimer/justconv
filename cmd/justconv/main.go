package main

import (
	"github.com/henriquemdimer/justconv/internal/application/handlers"
	"github.com/henriquemdimer/justconv/internal/infra/bus"
	"github.com/henriquemdimer/justconv/internal/infra/persistence/cache/inmemory"
	"github.com/henriquemdimer/justconv/internal/infra/server"
	"github.com/henriquemdimer/justconv/pkg/justconv"
)

func main() {
	commandBus := bus.NewDefaultCommandBus()
	eventBus := bus.NewDefaultEventBus()
	queryBus := bus.NewDefaultQueryBus()

	conv_cache := inmemory.NewInMemoryConversionListCache(eventBus)
	conversor := justconv.New()

	commandHandler := handlers.NewCommandHandler(eventBus, conv_cache, conversor)
	commandBus.RegisterHandler("CreateUpload", commandHandler.CreateUploadHandler)

	queryHandler := handlers.NewQueryHandler(conv_cache)
	queryBus.RegisterHandler("GetConversion", queryHandler.GetConversion)

	sv := server.NewHTTPServer(commandBus, queryBus, nil)
	go conversor.Init()
	sv.Init()
}

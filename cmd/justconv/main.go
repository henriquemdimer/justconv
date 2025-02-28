package main

import (
	"github.com/henriquemdimer/justconv/internal/application/commands"
	"github.com/henriquemdimer/justconv/internal/application/handlers"
	"github.com/henriquemdimer/justconv/internal/domain"
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
	commandBus.RegisterHandler("SetConversionStatus", commandHandler.SetConversionStatus)

	queryHandler := handlers.NewQueryHandler(conv_cache)
	queryBus.RegisterHandler("GetConversion", queryHandler.GetConversion)

	ListenToConversorEvents(*conversor, commandBus)
	go conversor.Init()

	sv := server.NewHTTPServer(commandBus, queryBus, nil)
	sv.Init()
}

func ListenToConversorEvents(conversor justconv.JustConv, commandBus domain.CommandBus) {
	conversor.GetEventBus().RegisterHandler(justconv.TaskDoneEvent,
		func(task *justconv.Task[string]) {
			commandBus.Dispatch(commands.SetConversionStatus{
				TaskId: string(task.Id),
				Status: justconv.STATUS[justconv.TASK_DONE],
			})
		})
}

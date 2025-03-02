package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

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
	commandBus.RegisterHandler("UpdateConversion", commandHandler.UpdateConversionHandler)

	queryHandler := handlers.NewQueryHandler(conv_cache)
	queryBus.RegisterHandler("GetConversion", queryHandler.GetConversion)

	ListenToConversorEvents(*conversor, commandBus)
	sv := server.NewHTTPServer(commandBus, queryBus, nil)

	go conversor.Init()
	go sv.Init()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	sig := <-sigChan
	log.Printf("Received signal %s, gracefully exiting...", sig)

	conversor.Deinit()
	sv.Deinit()
}

func ListenToConversorEvents(conversor justconv.JustConv, commandBus domain.CommandBus) {
	conversor.GetEventBus().RegisterHandler(justconv.TaskDoneEvent,
		func(task *justconv.Task[string]) {
			commandBus.Dispatch(commands.UpdateConversion{
				TaskId:     string(task.Id),
				Status:     justconv.STATUS[justconv.TASK_DONE],
				OutputPath: task.Result.Result,
			})
		})
}

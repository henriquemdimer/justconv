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
	"github.com/henriquemdimer/justconv/internal/infra/notifier"
	"github.com/henriquemdimer/justconv/internal/infra/persistence/cache/inmemory"
	"github.com/henriquemdimer/justconv/internal/infra/server"
	"github.com/henriquemdimer/justconv/internal/infra/server/ws"
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
	ws_server := ws.NewWebsocketServer()

	_notifier := notifier.NewWebsocketNotifier(ws_server)
	eventHandler := handlers.NewEventHandler(_notifier)
	eventBus.RegisterHandler("ConversionUpdated", eventHandler.ConversionUpdatedHandler)

	handler := sv.LoadHandlers()

	handler.Get("/ws", ws_server.Upgrade)

	go conversor.Init()
	go sv.Init(handler)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	sig := <-sigChan
	log.Printf("Received signal %s, gracefully exiting...", sig)

	conversor.Deinit()
	sv.Deinit()
}

func ListenToConversorEvents(conversor justconv.JustConv, commandBus domain.CommandBus) {
	conversor.GetEventBus().RegisterHandler(justconv.TaskStatusUpdateEvent,
		func(task *justconv.Task[string]) {
			output := ""

			if task.Result != nil {
				output = task.Result.Result
			}

			commandBus.Dispatch(commands.UpdateConversion{
				TaskId:     string(task.Id),
				Status:     justconv.STATUS[task.Status],
				OutputPath: output,
			})
		})
}

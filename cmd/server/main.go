package main

import (
	"log"

	"github.com/henriquemdimer/justconv/internal/auth"
	"github.com/henriquemdimer/justconv/internal/database"
	"github.com/henriquemdimer/justconv/internal/events"
	"github.com/henriquemdimer/justconv/internal/logger"
	"github.com/henriquemdimer/justconv/internal/modmgr"
	"github.com/henriquemdimer/justconv/internal/server"
	"github.com/henriquemdimer/justconv/pkg/bus"
)

func main() {
	event_bus := bus.NewDefaultBus()

	manager := modmgr.New(event_bus)
	manager.Register(auth.New(event_bus))
	manager.Register(logger.New())
	manager.Register(server.New(server.NewHttpDriver(event_bus, nil)))
	manager.Register(database.New(database.NewMemoryDriver(event_bus)))

	event_bus.Subscribe(events.MODULE_LOADED, func(ev any) {
		log.Println("Module loaded:", ev)
	})

	event_bus.Subscribe(events.MODULE_LOADING_DONE, func(ev any) {
		log.Println("All modules loaded.")
	})

	manager.Init()
}

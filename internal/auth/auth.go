package auth

import (
	"github.com/henriquemdimer/justconv/internal/modmgr"
	"github.com/henriquemdimer/justconv/internal/types"
	"github.com/henriquemdimer/justconv/pkg/bus"
)

type AuthModule struct {
	event_bus bus.Bus
}

func New(event_bus bus.Bus) modmgr.Module {
	return &AuthModule{
		event_bus,
	}
}

func (a *AuthModule) Name() string {
	return "Endpoint Authentication Module"
}

func (a *AuthModule) Id() string {
	return "auth"
}

func (a *AuthModule) DependsOn() []string {
	return []string{"logger", "server", "database"}
}

func (a *AuthModule) Export(_ modmgr.Module) any {
	return nil
}

func (a *AuthModule) Init(deps map[string]any) {
	logger, ok := deps["logger"].(types.Logger)
	if !ok {
		panic("missing required module: logger")
	}

	server, ok := deps["server"].(types.ServerRouter)
	if !ok {
		logger.Fatal("missing required module: server")
	}

	database, ok := deps["database"].(types.Database)
	if !ok {
		logger.Fatal("missing required module: database")
	}

	repo := NewRepository(database)
	service := NewService(repo)
	
	controller := NewController(service)
	controller.LoadRoutes(server)
}

func (a *AuthModule) Start() {}

package server

import (
	"github.com/henriquemdimer/justconv/internal/modmgr"
)

type ServerModule struct {
	driver ServerDriver
}

func New(driver ServerDriver) modmgr.Module {
	return &ServerModule{
		driver,
	}
}

func (s *ServerModule) DependsOn() []string {
	return []string{}
}

func (s *ServerModule) Id() string {
	return "server"
}

func (s *ServerModule) Name() string {
	return "Server Abstraction Module"
}

func (s *ServerModule) Export(_ modmgr.Module) any {
	return NewPublicDriver(s.driver)
}

func (s *ServerModule) Init(_ map[string]any) {}

func (s *ServerModule) Start() {
	s.driver.Init()
}

package server

import "github.com/henriquemdimer/justconv/internal/types"

type ServerDriver interface {
	Init()
	Deinit()
	RegisterHandler(string, func(types.RequestContext) types.Response)
}

type PublicServerDriver struct {
	driver ServerDriver
}

func NewPublicDriver(driver ServerDriver) types.ServerRouter {
	return &PublicServerDriver{
		driver,
	}
}

func (p *PublicServerDriver) RegisterHandler(path string, handler func(types.RequestContext) types.Response) {
	p.driver.RegisterHandler(path, handler)
}

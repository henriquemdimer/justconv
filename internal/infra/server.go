package server

import (
	"fmt"
	"net/http"

	"github.com/henriquemdimer/justconv/internal/controllers"
	"github.com/henriquemdimer/justconv/internal/domain"
)

type Server struct {
	options *ServerOptions
}

type ServerOptions struct {
	Port string
}

func validateOptions(options *ServerOptions) *ServerOptions {
	validated := &ServerOptions{
		Port: "8080",
	}

	if options != nil {
		if options.Port != "" {
			validated.Port = options.Port
		}
	}

	return validated
}

func NewServer(options *ServerOptions) *Server {
	return &Server{
		options: validateOptions(options),
	}
}

func (self *Server) Init() {
	self.loadHandlers()
	http.ListenAndServe(fmt.Sprintf(":%s", self.options.Port), nil)
}

func (self *Server) loadHandlers() {
	cs := []domain.Controller{controllers.NewHealthController()}

	for _, controller := range cs {
		controller.Load(http.DefaultServeMux)
	}
}

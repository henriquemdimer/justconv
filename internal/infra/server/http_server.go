package server

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/infra/server/helper"
	"github.com/henriquemdimer/justconv/internal/presentation/convert"
	"github.com/henriquemdimer/justconv/internal/presentation/health"
)

type HTTPServer struct {
	commandBus domain.CommandBus
	queryBus   domain.QueryBus
	options    *HTTPServerOptions
	server     *http.Server
}

type HTTPServerOptions struct {
	Port string
}

func validateOptions(options *HTTPServerOptions) *HTTPServerOptions {
	validated := &HTTPServerOptions{
		Port: "8080",
	}

	if options != nil {
		if options.Port != "" {
			validated.Port = options.Port
		}
	}

	return validated
}

func NewHTTPServer(commandBus domain.CommandBus, queryBus domain.QueryBus, options *HTTPServerOptions) *HTTPServer {
	return &HTTPServer{
		options:    validateOptions(options),
		commandBus: commandBus,
		queryBus:   queryBus,
	}
}

func (self *HTTPServer) Init(r http.Handler) {
	self.server = &http.Server{
		Addr: fmt.Sprintf(":%s", self.options.Port),
	}

	self.server.Handler = r
	self.server.ListenAndServe()
}

func (self *HTTPServer) Deinit() {
	self.server.Shutdown(nil)
}

func (self *HTTPServer) LoadHandlers() chi.Router {
	cs := []domain.Handler{health.Load, convert.Load}

	writer := helper.NewHTTPWriter()
	router := chi.NewRouter()
	for _, handler := range cs {
		handler(router, writer, self.commandBus, self.queryBus)
	}

	return router
}

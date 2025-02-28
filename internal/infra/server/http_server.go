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
	queryBus domain.QueryBus
	options *HTTPServerOptions
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
		options: validateOptions(options),
		commandBus: commandBus,
		queryBus: queryBus,
	}
}

func (self *HTTPServer) Init() {
	r := self.loadHandlers()
	http.ListenAndServe(fmt.Sprintf(":%s", self.options.Port), r)
}

func (self *HTTPServer) loadHandlers() chi.Router {
	cs := []domain.Handler{health.Load, convert.Load}

	writer := helper.NewHTTPWriter()
	router := chi.NewRouter()
	for _, handler := range cs {
		handler(router, writer, self.commandBus, self.queryBus)
	}

	return router
}

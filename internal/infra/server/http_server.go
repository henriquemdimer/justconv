package server

import (
	"fmt"
	"net/http"

	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/health"
)

type HTTPServer struct {
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

func NewHTTPServer(options *HTTPServerOptions) *HTTPServer {
	return &HTTPServer{
		options: validateOptions(options),
	}
}

func (self *HTTPServer) Init() {
	self.loadHandlers()
	http.ListenAndServe(fmt.Sprintf(":%s", self.options.Port), nil)
}

func (self *HTTPServer) loadHandlers() {
	cs := []domain.Handler{health.NewHandler()}

	for _, controller := range cs {
		controller.Load(http.DefaultServeMux)
	}
}

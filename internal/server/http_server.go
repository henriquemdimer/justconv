package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/henriquemdimer/justconv/internal/events"
	"github.com/henriquemdimer/justconv/internal/types"
	"github.com/henriquemdimer/justconv/pkg/bus"
)

type HttpDriver struct {
	event_bus bus.Bus
	options   *HttpDriverOptions
	server    *http.Server
	handler   *http.ServeMux
}

type HttpDriverOptions struct {
	Port         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

func validateOptions(options *HttpDriverOptions) *HttpDriverOptions {
	validatedOptions := &HttpDriverOptions{
		Port:         "8080",
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
	}

	if options != nil {
		if options.Port != "" {
			validatedOptions.Port = options.Port
		}

		if options.ReadTimeout != 0 {
			validatedOptions.ReadTimeout = options.ReadTimeout
		}

		if options.WriteTimeout != 0 {
			validatedOptions.WriteTimeout = options.WriteTimeout
		}
	}

	return validatedOptions
}

func NewHttpDriver(event_bus bus.Bus, options *HttpDriverOptions) ServerDriver {
	validatedOptions := validateOptions(options)
	handler := http.NewServeMux()
	server := &http.Server{
		Addr:         fmt.Sprintf("0.0.0.0:%s", validatedOptions.Port),
		ReadTimeout:  validatedOptions.ReadTimeout,
		WriteTimeout: validatedOptions.WriteTimeout,
		Handler:      handler,
	}

	return &HttpDriver{
		event_bus: event_bus,
		options: validatedOptions,
		server:  server,
		handler: handler,
	}
}

func (h *HttpDriver) middleware(next http.Handler) http.Handler {
		return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {
			h.event_bus.Dispatch(events.SERVER_PRE_REQUEST, nil)
			next.ServeHTTP(w, r)
		})
}

func (h *HttpDriver) Init() {
	mux := h.middleware(h.handler)
	h.server.Handler = mux
	if err := h.server.ListenAndServe(); err != nil {
		panic(err)
	}
}

func (h *HttpDriver) Deinit() {}

func (h *HttpDriver) RegisterHandler(endpoint string, handler func(types.RequestContext) types.Response) {
	h.event_bus.Dispatch(events.SERVER_HANDLER_REGISTERED, nil)

	h.handler.HandleFunc(endpoint, func(w http.ResponseWriter, r *http.Request) {
		h.event_bus.Dispatch(events.SERVER_REQUEST, nil)

		ret := handler(types.RequestContext{
			Ip: r.RemoteAddr,
		})

		if ret.StatusCode == 0 {
			ret.StatusCode = 200
		}

		w.WriteHeader(ret.StatusCode)
		json.NewEncoder(w).Encode(ret)
	})
}

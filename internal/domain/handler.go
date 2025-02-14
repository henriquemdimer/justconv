package domain

import "net/http"

type Handler interface {
	Load(mux *http.ServeMux)
}

package domain

import "net/http"

type Controller interface {
	Load(mux *http.ServeMux)
}

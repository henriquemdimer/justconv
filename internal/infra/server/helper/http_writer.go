package helper

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type HTTPWriter struct {}

func NewHTTPWriter() *HTTPWriter {
	return &HTTPWriter{}
}

func (self *HTTPWriter) WriteJson(wr any, statusCode int, response domain.RequestResponse) error {
	w, ok := wr.(http.ResponseWriter)
	if !ok {
		return errors.New("Invalid writer")
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
	return nil
}

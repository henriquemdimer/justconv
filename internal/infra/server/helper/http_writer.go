package helper

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type HTTPWriter struct{}

func NewHTTPWriter() *HTTPWriter {
	return &HTTPWriter{}
}

func (self *HTTPWriter) WriteJson(wr interface{}, statusCode int, response domain.RequestResponse) error {
	w, ok := wr.(http.ResponseWriter)
	if !ok {
		return errors.New("Invalid writer")
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
	return nil
}

func (self *HTTPWriter) WriteError(wr interface{},
	status int,
	response *domain.RequestResponseError) error {
	w, ok := wr.(http.ResponseWriter)
	if !ok {
		return errors.New("Invalid writer")
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if response == nil {
		response = &domain.RequestResponseError{
			Code: status,
			Error: getErrorMessage(status),
		}
	} else {
		if response.Error == "" {
			response.Error = getErrorMessage(status)
		}
	}

	json.NewEncoder(w).Encode(response)
	return nil
}

func getErrorMessage(code int) string {
	switch code {
	case 500:
		return "Internal Server Error"
	case 404:
		return "Not Found"
	case 400:
		return "Bad Request"
	}

	return "Unknown Error"
}

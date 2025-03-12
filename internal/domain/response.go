package domain

type RequestResponse struct {
	Message string         `json:"message"`
	Data    map[string]any `json:"data"`
	Code    int            `json:"code"`
}

type RequestResponseError struct {
	Code  int    `json:"code"`
	Error string `json:"error"`
}

type Writer interface {
	WriteJson(interface{}, int, RequestResponse) error
	WriteError(interface{}, int, *RequestResponseError) error
}

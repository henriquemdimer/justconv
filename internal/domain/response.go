package domain

type RequestResponse struct {
	Message string            `json:"message"`
	Data    map[string]string `json:"data"`
	Code    int               `json:"code"`
}

type Writer interface {
	WriteJson(any, int, RequestResponse) error
}

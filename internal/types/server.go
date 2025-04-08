package types

type RequestContext struct {
	Ip string
}

type Response struct {
	StatusCode int `json:"status_code"`
	Data any `json:"data"`
	Error string `json:"error"`
}

type ServerRouter interface {
	RegisterHandler(endpoint string, handler func(RequestContext) Response)
}

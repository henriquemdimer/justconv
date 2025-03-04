package ws

type Message struct {
	Op   int         `json:"op"`
	Data interface{} `json:"data"`
}

type SubscribeData struct {
	Id string `json:"id"`
}

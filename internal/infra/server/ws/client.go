package ws

import "github.com/gorilla/websocket"

type Client struct {
	Id            string
	conn          *websocket.Conn
	Subscriptions []string
}

func NewClient(id string, conn *websocket.Conn) *Client {
	return &Client{
		Id: id,
		Subscriptions: []string{},
		conn: conn,
	}
}

func (self *Client) GetConn() *websocket.Conn {
	return self.conn
}

func (self *Client) Subscribe(id string) {
	self.Subscriptions = append(self.Subscriptions, id)
}

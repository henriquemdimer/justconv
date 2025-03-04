package ws

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type WebsocketServer struct {
	upgrader websocket.Upgrader
	clients  map[string]*Client
}

func NewWebsocketServer() *WebsocketServer {
	return &WebsocketServer{
		upgrader: websocket.Upgrader{},
		clients:  make(map[string]*Client),
	}
}

func (self *WebsocketServer) Upgrade(w http.ResponseWriter, r *http.Request) {
	conn, err := self.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade connection:", err)
		return
	}

	ip := conn.LocalAddr().String()
	if self.clients[ip] != nil {
		self.Disconnect(self.clients[ip])
	}

	self.clients[ip] = NewClient(ip, conn)
	defer self.Disconnect(self.clients[ip])

	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("Failed to read client message:", err)
			break
		}

		ok := self.handleMessage(msg, conn)
		if !ok {
			break
		}
	}
}

func (self *WebsocketServer) Disconnect(client *Client) {
	client.GetConn().Close()
	delete(self.clients, client.Id)
}

func (self *WebsocketServer) handleMessage(msg Message, conn *websocket.Conn) bool {
	switch msg.Op {
	case SubscribeOP:
		client := self.clients[conn.LocalAddr().String()]
		if client == nil {
			return false
		}

		_data, err := json.Marshal(msg.Data)
		var data SubscribeData
		if err = json.Unmarshal(_data, &data); err != nil {
			log.Printf("Failed to decode message data: %s\n", err)
			return false
		}

		client.Subscribe(data.Id)
		return true
	}

	return false
}

func (self *WebsocketServer) Broadcast(msg string) {
	for _, client := range self.clients {
		err := client.GetConn().WriteMessage(websocket.TextMessage, []byte(msg))
		if err != nil {
			log.Printf("Failed to write to client %s: %s\n", client.GetConn().LocalAddr().String(), err)
		}
	}
}

func (self *WebsocketServer) SendToSubscribed(msg Message, subId string) {
	for _, client := range self.clients {
		for _, subs := range client.Subscriptions {
			if subs == subId {
				client.GetConn().WriteJSON(msg)
			}
		}
	}
}

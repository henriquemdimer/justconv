package ws

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/henriquemdimer/justconv/internal/application/query"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/conversion"
	"github.com/henriquemdimer/justconv/internal/infra/bus"
)

type WebsocketServer struct {
	upgrader  websocket.Upgrader
	clients   map[string]*Client
	query_bus domain.QueryBus
}

func NewWebsocketServer(query_bus domain.QueryBus) *WebsocketServer {
	return &WebsocketServer{
		upgrader: websocket.Upgrader{
			CheckOrigin: func(_ *http.Request) bool {
				return true
			},
		},
		clients:   make(map[string]*Client),
		query_bus: query_bus,
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
		conv, err := bus.QueryAsk[conversion.Conversion](
			self.query_bus,
			query.GetConversion{Id: data.Id},
		)
		if conv != nil && err == nil {
			self.SendToSubscribed(Message{
				Op: 0,
				Data: domain.ConversionUpdateNotification{
					Id: conv.GetId(),
					Status: conv.GetStatus(),
				},
			}, conv.GetId())
		}

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

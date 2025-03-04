package notifier

import (
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/infra/server/ws"
)

type WebsocketNotifier struct {
	ws *ws.WebsocketServer
}

func NewWebsocketNotifier(ws *ws.WebsocketServer) domain.Notifier {
	return &WebsocketNotifier{
		ws,
	}
}

func (self *WebsocketNotifier) NotifyConversionUpdate(conv_id string, data map[string]string) {
	self.ws.SendToSubscribed(ws.Message{
		Op: ws.ConversionUpdatedOP,
		Data: data,
	}, conv_id)
}

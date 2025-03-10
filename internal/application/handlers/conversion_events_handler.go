package handlers

import (
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/conversion"
)

func (self *EventHandler) ConversionUpdatedHandler(event domain.Event) {
	if ev, ok := event.(conversion.ConversionUpdated); ok {
		self.notifier.NotifyConversionUpdate(ev.Id, domain.ConversionUpdateNotification{
			Id: ev.Id,
			Status: ev.Status,
		})
	}
}

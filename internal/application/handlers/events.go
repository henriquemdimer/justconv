package handlers

import (
	"github.com/henriquemdimer/justconv/internal/domain"
)

type EventHandler struct {
	notifier domain.Notifier
}

func NewEventHandler(notifier domain.Notifier) *EventHandler {
	return &EventHandler{
		notifier,
	}
}

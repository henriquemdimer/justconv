package domain

type ConversionUpdateNotification struct {
	Id     string `json:"id"`
	Status string `json:"status"`
}

type Notifier interface {
	NotifyConversionUpdate(string, ConversionUpdateNotification)
}

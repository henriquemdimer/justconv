package domain

type Notifier interface {
	NotifyConversionUpdate(string, map[string]string)
}

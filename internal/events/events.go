package events

const (
	MODULE_LOADED             = "modmgr.module_loaded"
	MODULE_LOADING_DONE       = "modmgr.module_load_done"
	SERVER_PRE_REQUEST        = "server.pre_request"
	SERVER_REQUEST            = "server.request"
	SERVER_HANDLER_REGISTERED = "server.handler_registrered"
	DATABASE_INSERT           = "database.insert"
	LOG                       = "log.send_log"
)

type LogEventPayload struct {
	level   string
	message string
}

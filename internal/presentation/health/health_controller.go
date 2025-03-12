package health

import (
	"net/http"

	"github.com/henriquemdimer/justconv/internal/application/query"
	"github.com/henriquemdimer/justconv/internal/domain"
)

type Controller struct {
	writer domain.Writer
	queryBus domain.QueryBus
}

func NewController(writer domain.Writer, queryBus domain.QueryBus) *Controller {
	return &Controller{
		writer,
		queryBus,
	}
}

func (self *Controller) GetHealth(w http.ResponseWriter, r *http.Request) {
	formats, err := self.queryBus.Ask(query.GetSupportedFormats{})
	if err != nil {
		self.writer.WriteError(w, 500, nil)
		return
	}

	self.writer.WriteJson(w, 200, domain.RequestResponse{
		Message: "HEALTHY",
		Code: 200,
		Data: map[string]any{
			"formats": formats,
		},
	})
}

package health

import (
	"net/http"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type Controller struct {
	writer domain.Writer
}

func NewController(writer domain.Writer) *Controller {
	return &Controller{
		writer,
	}
}

func (self *Controller) GetHealth(w http.ResponseWriter, r *http.Request) {
	self.writer.WriteJson(w, 200, domain.RequestResponse{
		Message: "HEALTHY",
		Code: 200,
	})
}

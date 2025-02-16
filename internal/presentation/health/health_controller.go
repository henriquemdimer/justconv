package health

import (
	"fmt"
	"net/http"
)

type Controller struct {}

func NewController() *Controller {
	return &Controller{}
}

func (self *Controller) GetHealth(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "HEALTH OK")
}

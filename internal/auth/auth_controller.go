package auth

import (
	"strings"

	"github.com/henriquemdimer/justconv/internal/types"
)

type AuthController struct {
	service *AuthService
}

func NewController(service *AuthService) *AuthController {
	return &AuthController{
		service,
	}
}

func (c *AuthController) LoadRoutes(h types.ServerRouter) {
	h.RegisterHandler("POST /auth/register", c.register)
	h.RegisterHandler("POST /auth/login", c.login)
	h.RegisterHandler("POST /auth/guest", c.temporaryGuest)
}

func (c *AuthController) register(ctx types.RequestContext) types.Response {
	return types.Response{}
}

func (c *AuthController) login(ctx types.RequestContext) types.Response {
	return types.Response{}
}

func (c *AuthController) temporaryGuest(ctx types.RequestContext) types.Response {
	ip := strings.Split(ctx.Ip, ":")[0]
	guest, token, err := c.service.CreateGuest(ip)
	if err != nil {
		return types.Response{
			StatusCode: 500,
			Error: err.Error(),
		}
	}

	return types.Response{
		StatusCode: 201,
		Data: map[string]any{
			"token": token,
			"user": guest,
		},
	}
}

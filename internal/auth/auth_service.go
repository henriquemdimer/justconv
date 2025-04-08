package auth

import (
	"errors"

	"github.com/google/uuid"
	"github.com/henriquemdimer/justconv/internal/config"
)

type AuthService struct {
	repo *Repository
}

func NewService(repo *Repository) *AuthService {
	return &AuthService{
		repo,
	}
}

func (s *AuthService) CreateGuest(ip string) (*UserDTO, string, error) {
	if config.Content.Auth.Required {
		return nil, "", errors.New("Authentication is required, you must create a full user account")
	}

	var user *User

	user = s.repo.GetByIp(ip)
	if user != nil {
		token, err := GenerateToken(user.Id)
		return user.toDTO(), token, err
	}

	user = NewUser("guest-"+uuid.NewString(), ip, true)
	s.repo.Set(user)

	token, err := GenerateToken(user.Id)
	return user.toDTO(), token, err
}



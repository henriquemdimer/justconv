package auth

import "github.com/google/uuid"

type User struct {
	Id       string
	Username string
	Ip       string
	Guest    bool
}

type UserDTO struct {
	Username string `json:"username"`
	Id string `json:"id"`
}

func NewUser(username string, ip string, guest bool) *User {
	return &User{
		Id:       uuid.NewString(),
		Username: username,
		Ip:       ip,
		Guest:    guest,
	}
}

func (u *User) toDTO() *UserDTO {
	return &UserDTO{
		Username: u.Username,
		Id: u.Id,
	}
}

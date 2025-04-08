package auth

import "github.com/henriquemdimer/justconv/internal/types"

// type Repository interface {
// 	GetById(string) *User
// 	GetByIp(string) *User
// 	GetAllGuests() []*User
// 	Set(*User)
// 	Delete(string)
// }

type Repository struct {
	db types.Database
}

func NewRepository(db types.Database) *Repository {
	return &Repository{
		db,
	}
}

func (r *Repository) GetById(id string) (user *User) {
	r.db.Query("users", types.Filter{ "Id": id }, &user)
	return
}

func (r *Repository) GetByIp(ip string) (user *User) {
	r.db.Query("users", types.Filter{ "Ip": ip }, &user)
	return
}

func (r *Repository) Set(user *User) {
	r.db.Insert("users", user)
}

func (r *Repository) Delete(id string) {
	r.db.Delete("users", types.Filter{ "Id": id })
}

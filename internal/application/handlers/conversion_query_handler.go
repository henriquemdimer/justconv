package handlers

import (
	"errors"

	"github.com/henriquemdimer/justconv/internal/application/query"
	"github.com/henriquemdimer/justconv/internal/domain"
)

func (self *QueryHandler) GetConversion(_query domain.Query) (interface{}, error) {
	if q, ok := _query.(query.GetConversion); ok {
		conv := self.conv_cache.Get(q.Id)
		return conv, nil
	} else {
		return nil, errors.New("Invalid query")
	}
}

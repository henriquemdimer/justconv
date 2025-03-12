package handlers

import (
	"errors"

	"github.com/henriquemdimer/justconv/internal/application/query"
	"github.com/henriquemdimer/justconv/internal/domain"
)

func (self *QueryHandler) GetConversion(_query domain.Query) (any, error) {
	if q, ok := _query.(query.GetConversion); ok {
		conv := self.conv_cache.Get(q.Id)
		return conv, nil
	} else {
		return nil, errors.New("Invalid query")
	}
}

func (self *QueryHandler) GetSupportedFormats(_query domain.Query) (any, error) {
	if _, ok := _query.(query.GetSupportedFormats); ok {
		formats := self.conversor.GetFormatsTable()
		return formats, nil
	} else {
		return nil, errors.New("Invalid query")
	}
}

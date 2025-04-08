package auth

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

var secret = []byte("oakdoaksd")

func GenerateToken(id string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
	})

	signedToken, err := token.SignedString(secret)
	return signedToken, err
}

func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(tkn *jwt.Token) (any, error) {
		if _, ok := tkn.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Invalid JWT token")
		}

		return secret, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		id := claims["id"]
		if id == "" || id == nil {
			return "", errors.New("JWT Token returned invalid claims")
		}

		return id.(string), nil
	} else {
		return "", errors.New("Failed to get claims from token")
	}
}

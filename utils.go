package main

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type Auth struct {
	Id       int    `gorm:"primary key"`
	Email    string `json:"Email"`
	Username string `json:"Username"`
	Password string `json:"Password"`
}

type User struct {
	Id       int
	Username string
}

type Input struct {
	Id     int    `gorm:"primary key"`
	Sender int    `json:"Sender"`
	Target int    `json:"Target"`
	Text   string `json:"Text"`
}

var secret_key = os.Getenv("SECRET_KEY")

var jwtSecret = []byte(secret_key) // Replace with a secure key

// GenerateToken generates a JWT token
func GenerateToken(userId int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expiry time
		"iat":     time.Now().Unix(),                     // Issued at
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
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

func signIn(c *gin.Context) {

	var userInput Auth
	var storedUser Auth

	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Find user by email
	result := db.Where("email = ?", userInput.Email).First(&storedUser)
	if result.Error != nil {
		c.JSON(401, gin.H{"error": "Invalid email or password"})
		return
	}

	// Verify password
	if userInput.Password != storedUser.Password {
		c.JSON(401, gin.H{"error": "Invalid email or password"})
		return
	}

	user := User{
		Id:       storedUser.Id,
		Username: storedUser.Username,
	}

	// Return success response
	c.JSON(200, gin.H{"message": "Login successful", "user": user})
}

func signUp(c *gin.Context) {

	var newUser Auth

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&newUser).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	user := User{
		Id:       newUser.Id,
		Username: newUser.Username,
	}

	c.JSON(200, gin.H{"message": "SignUp successful", "user": user})
}

func getAllUser(c *gin.Context) {

	var usernames []User

	userId, err := strconv.Atoi(c.Query("userId"))

	if err != nil {
		log.Println("UserId not provided")
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserId not provided"})
		return
	}

	// Query only the 'id' column and scan results into the 'usernames' slice
	db.Model(&Auth{}).Select("id, username").Where("id != ?", userId).Scan(&usernames)

	c.JSON(http.StatusOK, usernames)
}

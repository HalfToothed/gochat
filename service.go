package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Auth struct {
	Email    string `json:"Email"`
	Username string `json:"Username"`
	Password string `json:"Password"`
}

var currentUser string

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

	currentUser = storedUser.Username

	// Return success response
	c.JSON(200, gin.H{"message": "Login successful", "user": storedUser.Username})
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

	c.JSON(201, newUser)
}

func getAllUser(c *gin.Context) {

	var usernames []string

	// Query only the 'Username' column and scan results into the 'usernames' slice
	result := db.Model(&Auth{}).Where("username != ?", currentUser).Pluck("Username", &usernames)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
	}

	c.JSON(http.StatusOK, usernames)
}

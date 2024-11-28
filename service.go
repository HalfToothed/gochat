package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type User struct {
	Email    string `json:"Email"`
	Username string `json:"Username"`
	Password string `json:"Password"`
}

func signIn(c *gin.Context) {

	var userInput User
	var storedUser User

	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Find user by username
	result := db.Where("username = ?", userInput.Username).First(&storedUser)
	if result.Error != nil {
		c.JSON(401, gin.H{"error": "Invalid username or password"})
		return
	}

	// Verify password
	if userInput.Password != storedUser.Password {
		c.JSON(401, gin.H{"error": "Invalid username or password"})
		return
	}

	// Return success response
	c.JSON(200, gin.H{"message": "Login successful", "user": storedUser.Username})
}

func signUp(c *gin.Context) {

	var newUser User

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
	c.IndentedJSON(http.StatusOK, "")
}

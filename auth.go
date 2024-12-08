package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

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
	if userInput.Password == storedUser.Password {

		user := User{
			Id:       storedUser.Id,
			Username: storedUser.Username,
		}

		token, err := GenerateToken(user.Id)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token, "user": user})

	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}
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

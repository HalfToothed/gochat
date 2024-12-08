package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getAllUser(c *gin.Context) {

	var usernames []User

	userId := c.GetInt("user_id")

	// Query only the 'id' column and scan results into the 'usernames' slice
	db.Model(&Auth{}).Select("id, username").Where("id != ?", userId).Scan(&usernames)

	c.JSON(http.StatusOK, usernames)
}

func getChatHistory(c *gin.Context) {

	userId := c.GetInt("user_id")

	// Initialize a slice to hold the results
	var messages []Input

	// Fetch messages where Sender or Target equals userId
	err := db.Model(&Input{}).Where("sender = ? OR target = ?", userId, userId).Find(&messages).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No messages"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func getOnlineUser(c *gin.Context) {

	keys := make([]int, 0, len(clientsMap))
	for k := range clientsMap {
		keys = append(keys, k)
	}

	c.JSON(http.StatusOK, keys)
}

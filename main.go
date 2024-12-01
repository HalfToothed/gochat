package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	cors "github.com/rs/cors/wrapper/gin"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clientsMap = make(map[string]*websocket.Conn)

func main() {
	initDatabase()

	router := gin.Default()
	router.Use(cors.Default())

	router.POST("/signIn", signIn)
	router.POST("/signUp", signUp)
	router.GET("/getAllUsers/:username", getAllUser)

	// Serve React static files (wildcard path should be last)
	router.Static("/assets", "./client/dist/assets")
	router.NoRoute(func(c *gin.Context) {
		c.File("./client/dist/index.html")
	})

	router.GET("/ws", handleWebSocket)

	port := os.Getenv("PORT") // Fetch the port from environment variables
	if port == "" {
		port = "8080" // Default port for local development
	}
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

func handleWebSocket(c *gin.Context) {

	// Upgrade HTTP request to WebSocket
	websocket, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}

	defer websocket.Close()

	// Extract username from query parameters
	username := c.Request.URL.Query().Get("username")
	if username == "" {
		log.Println("Username not provided")
		websocket.Close()
		return
	}

	clientsMap[username] = websocket

	log.Printf("WebSocket connected: %s", username)

	// Listen for messages
	listen(websocket)

	delete(clientsMap, username)

	log.Printf("WebSocket disconnected: %s", username)
}

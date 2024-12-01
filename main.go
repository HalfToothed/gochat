package main

import (
	"log"
	"net/http"

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

	// Serve static files from the "dist" folder
	router.Static("/assets", "./client/dist/assets")
	router.StaticFile("/", "./client/dist/index.html")

	// Fallback for SPA routing - serve index.html for undefined routes
	router.NoRoute(func(c *gin.Context) {
		c.File("./client/dist/index.html")
	})

	router.POST("/signIn", signIn)
	router.POST("/signUp", signUp)
	router.GET("/getAllUsers/:username", getAllUser)

	router.GET("/ws", handleWebSocket)

	// Start the server on port 8080
	log.Println("Server started on :8080")
	if err := router.Run(":8080"); err != nil {
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

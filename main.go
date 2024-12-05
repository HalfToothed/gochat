package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clientsMap = make(map[string]*websocket.Conn)

func init() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

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

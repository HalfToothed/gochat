package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clientsMap = make(map[int]*websocket.Conn)

// UnComment it for Local Devlopment

// func init() {
// 	err := godotenv.Load(".env")
// 	if err != nil {
// 		log.Fatal("Error loading .env file")
// 	}
// }

func main() {
	initDatabase()

	router := gin.Default()
	router.Use(cors.Default())

	router.POST("/signIn", signIn)
	router.POST("/signUp", signUp)
	router.GET("/getAllUsers", getAllUser)
	router.GET("/getChatHistory", getChatHistory)

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

	// Extract id from query parameters
	userId, err := strconv.Atoi(c.Query("userId"))

	if err != nil {
		log.Println("Socket UserId not provided")
		websocket.Close()
		return
	}

	clientsMap[userId] = websocket

	log.Printf("WebSocket connected: %d", userId)

	// Listen for messages
	listen(websocket)

	delete(clientsMap, userId)

	log.Printf("WebSocket disconnected: %d", userId)
}

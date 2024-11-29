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

	// fs := http.FileServer(http.Dir("./client"))
	// http.Handle("/", fs)

	initDatabase()

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/signIn", signIn)
	router.POST("/signUp", signUp)
	router.GET("/getAllUsers/:username", getAllUser)

	go router.Run("localhost:3000")

	go http.HandleFunc("/ws", handleWebSocket)

	log.Println("Server started on :8080")
	http.ListenAndServe(":8080", nil)
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP request to WebSocket
	websocket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	// Extract username from query parameters
	username := r.URL.Query().Get("username")
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

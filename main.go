package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	cors "github.com/rs/cors/wrapper/gin"
)

var clients []*websocket.Conn

type Input struct {
	User string
	Text string
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {

	// fs := http.FileServer(http.Dir("./client"))
	// http.Handle("/", fs)

	initDatabase()

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/signIn", signIn)
	router.POST("/signUp", signUp)
	router.GET("/getAllUsers", getAllUser)

	go router.Run("localhost:3000")

	go http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {

		websocket, err := upgrader.Upgrade(w, r, nil)

		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Websocket Connected!")
		listen(websocket)
	})

	http.ListenAndServe(":8080", nil)
}

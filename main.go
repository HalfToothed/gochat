package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients []*websocket.Conn

type Input struct {
	User string
	Text string
}

func main() {

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		websocket, err := upgrader.Upgrade(w, r, nil)

		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Websocket Connected!")
		listen(websocket)

	})

	http.ListenAndServe(":3000", nil)
}

func listen(conn *websocket.Conn) {

	clients = append(clients, conn)

	for {

		messageType, messageContent, err := conn.ReadMessage()

		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				removeClient(conn)
			}
			log.Println(err)
			return
		}

		var content Input
		json.Unmarshal([]byte(messageContent), &content)

		messageResponse := fmt.Sprintf("%s: %s", content.User, content.Text)

		for _, client := range clients {
			client.WriteMessage(messageType, []byte(messageResponse))
		}
	}
}

func removeClient(client *websocket.Conn) {
	for i, v := range clients {
		if v == client {
			clients = append(clients[:i], clients[i+1:]...)
		}
	}
}

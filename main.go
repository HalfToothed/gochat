package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var clients []*websocket.Conn

func main() {

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
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

	http.ListenAndServe(":8080", nil)
}

func listen(conn *websocket.Conn) {

	clients = append(clients, conn)

	for {

		messageType, messageContent, err := conn.ReadMessage()
		timeRecieve := time.Now()
		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				removeClient(conn)
			}
			log.Println(err)
			return
		}

		fmt.Println(clients)

		messageResponse := fmt.Sprintf("messageContnet: %s \n timeRecived: %v", messageContent, timeRecieve)

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

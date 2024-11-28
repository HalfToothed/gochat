package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

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

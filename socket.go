package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Input struct {
	Receiver string
	Sender   string
	Text     string
}

func listen(conn *websocket.Conn) {

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
		err = json.Unmarshal(messageContent, &content)
		if err != nil {
			log.Println("Error unmarshalling message:", err)
			continue
		}

		// Check if the receiver exists in the clientsMap
		receiverConn, exists := clientsMap[content.Receiver]
		if !exists {
			log.Println("Receiver not found:", content.Receiver)
			continue
		}

		// Send the message to the receiver
		messageResponse := fmt.Sprintf("%s: %s", content.Sender, content.Text)
		err = receiverConn.WriteMessage(messageType, []byte(messageResponse))
		if err != nil {
			log.Println("Error sending message to receiver:", err)
		}
	}
}

func removeClient(client *websocket.Conn) {
	// Remove the client from the clients map
	for username, conn := range clientsMap {
		if conn == client {
			delete(clientsMap, username)
			return
		}
	}
}

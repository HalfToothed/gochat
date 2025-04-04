package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

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

		if err := db.Create(&content).Error; err != nil {
			log.Println("database error:", err)
			return
		}

		// Check if the receiver exists in the clientsMap
		receiverConn, exists := clientsMap[content.Target]
		if !exists {
			log.Println("Receiver not found:", content.Target)
			continue
		}

		messageJSON, err := json.Marshal(content)
		if err != nil {
			log.Println("Error marshaling message:", err)
			return
		}

		// Send the message to the receiver
		err = receiverConn.WriteMessage(messageType, messageJSON)
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

import { useEffect, useRef, useState } from "react";

type Message = {
  Sender: string;
  Target: string;
  Text: string;
};

const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

   ws.current.onmessage = (event) => { 
    try {
          const data: Message = event.data;
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error("Error parsing message:", error, event.data);
        }
    };

    ws.current.onclose = () => setIsConnected(false);
    ws.current.onerror = (error) => console.error("WebSocket Error:", error);

    return () => ws.current?.close();
  }, [url]);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return { messages, sendMessage, isConnected };
};

export default useWebSocket;

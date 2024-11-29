import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    ws.current.onclose = () => setIsConnected(false);
    ws.current.onerror = (error) => console.error("WebSocket Error:", error);

    return () => ws.current?.close();
  }, [url]);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("sdfjas;lkfjasl;dfjask")
      ws.current.send(message);
    }
  };

  return { messages, sendMessage, isConnected };
};

export default useWebSocket;

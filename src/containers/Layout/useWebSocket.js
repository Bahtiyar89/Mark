import { useState, useEffect, useRef, useCallback } from "react";

const useWebSocket = (baseUrl, token) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const messageQueueRef = useRef([]);

  useEffect(() => {
    // Append the token as a query parameter
    const urlWithToken = `${baseUrl}?token=${token}`;
    // Initialize WebSocket connection with the token
    socketRef.current = new WebSocket(urlWithToken);
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log("WebSocket connected...");
      // Flush message queue
      while (messageQueueRef.current.length > 0) {
        const message = messageQueueRef.current.shift();
        socket.send(message);
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected1");
    };
    console.log("ccc:", socket);
    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [baseUrl, token]); // Include token in the dependency array

  const sendMessage = useCallback((message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.log("WebSocket is not open. Queuing message.");
      messageQueueRef.current.push(message);
    }
  }, []);

  return { messages, sendMessage };
};

export default useWebSocket;

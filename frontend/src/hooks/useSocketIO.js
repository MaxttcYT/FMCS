import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const SOCKET_SERVER_URL = process.env.API_URL;

export default function useSocketIO() {
  const [socket, setSocket] = useState(null);

  const connectSocket = useCallback(() => {
    // Disconnect previous socket if exists
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      reconnection: false,
      timeout: 5000,
    });

    newSocket.on("connect_error", () => {
      toast.error("Couldn't establish connection to server!", {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        theme: "dark",
      });
    });

    newSocket.on("connect", () => {
      toast.success("Successfully established connection to server!", {
        position: "top-right",
        closeOnClick: true,
        theme: "dark",
        autoClose: 1000,
      });
    });

    setSocket(newSocket);
  }, []); // ✅ empty dependency array

  useEffect(() => {
    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return { socket, reconnectSocket: connectSocket };
}

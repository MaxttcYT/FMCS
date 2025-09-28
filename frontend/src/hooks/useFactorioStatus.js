import { useState, useEffect } from "react";

export default  function useFactorioStatus(socket) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handler = (s) => setStatus(s);
    socket.on("factorio_running", handler);

    return () => socket.off("factorio_running", handler);
  }, [socket]);

  const start = () => socket?.emit("start_factorio");
  const stop = () => socket?.emit("stop_factorio");
  const kill = () => socket?.emit("kill_factorio");

  return { status, start, stop, kill };
}

import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
  toSocket,
} from "vscode-ws-jsonrpc";
import { MonacoLanguageClient } from "monaco-languageclient";

export const initWebSocketAndStartClient = (url) => {
  const webSocket = new WebSocket(url);

  webSocket.onopen = () => {
    // create message transport
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);

    // create language client
    const languageClient = createLanguageClient({ reader, writer });
    languageClient.start();

    reader.onClose(() => languageClient.stop());
  };

  return webSocket;
};

const createLanguageClient = (messageTransports) => {
  return new MonacoLanguageClient({
    name: "Sample Language Client",
    clientOptions: {
      documentSelector: ["python"],
    },
    connectionProvider: {
      get: async () => messageTransports,
    },
  });
};

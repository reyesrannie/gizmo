import Pusher from "pusher-js";
import Echo from "laravel-echo";

window.Pusher = Pusher;

Pusher.logToConsole = true;
// const baseUrl = "10.10.12.10";
const baseUrl = "192.168.254.132";

// const baseUrl = process.env.REACT_APP_WEBSOCKET_URL;

const EchoInstance = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_WEBSOCKET_KEY,
  wsHost: baseUrl,
  wsPort: process.env.REACT_APP_WEBSOCKET_PORT,
  forceTLS: false,
  encrypted: false,
  cluster: process.env.REACT_APP_WEBSOCKET_CLUSTER,
  enabledTransports: ["ws", "wss"],
});

const connection = EchoInstance.connector.pusher?.connection;

if (connection) {
  connection.bind("connected", () => {
    console.log("WebSocket is connected successfully!");
  });

  connection.bind("state_change", (states) => {
    console.log(
      `Connection state changed from ${states.previous} to ${states.current}`
    );
  });
} else {
  console.error("Failed to initialize WebSocket connection.");
}

export default EchoInstance;

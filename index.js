import WebSocket, { WebSocketServer } from "ws";
import { connection_handler } from "./connection_handler.js";
// import { listen_blockchain_events } from './blockchain_dispatcher.js';

function heartbeat() {
  this.isAlive = true;
}

const port = 8080;
const wss = new WebSocketServer({
  port: port,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

console.log("WebSocket server started on port " + port);

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  ws.isAlive = true;
  ws.on("pong", heartbeat);
  connection_handler(ws);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", function close() {
  clearInterval(interval);
});

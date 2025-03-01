const PORT = process.env.PORT || 8001;
const ENV = require("./environment");

const app = require("./application")(ENV, { updateAppointment });
const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

/**
 * Handles WebSocket connections for real-time updates.
 */
wss.on("connection", (socket) => {
  socket.onmessage = (event) => {
    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

/**
 * Broadcasts interview updates to all WebSocket clients.
 * @param {number} id - The appointment ID.
 * @param {object|null} interview - The interview data, or null if deleted.
 */
function updateAppointment(id, interview) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SET_INTERVIEW",
          id,
          interview,
        })
      );
    }
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});

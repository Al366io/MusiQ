const { startSetIntervals } = require("./controllers/controller");
const express = require("express");
const cors = require("cors");
const router = require("./router");
const app = express();
const port = 3001;
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
global.io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
}); //in case server and client run on different urls

app.use(express.json());
app.use(cors());
app.use(router);

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);
  socket.on("join-room", (room) => {
    socket.join(room);
  });
  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
  // this function is here because now we setInterval when room is created.
  // SO for development porpuses (we start/stop the server a bunch of times) i will look into db,
  // and manually start the set interval of the rooms that are there.
  // this is needed to have dashboard/adder page work even with a room created before restarting the server
  startSetIntervals();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});

const {
  generateRandomString,
  refreshExpiredToken,
  getPartyToken,
  getArtistGenre,
} = require("./helpers/helpers");

const express = require('express');
const cors = require('cors');
const router = require('./router');
const app = express();
const port = 3001;
const {socketIoGetPlayingSong} = require('./controllers/controller')
const http = require('http');
const server = http.createServer(app);
const socketIo = require("socket.io")
global.io = socketIo(server,{ 
  cors: {
    origin: 'http://localhost:3000'
  }
}) //in case server and client run on different urls

app.use(express.json());
app.use(cors());
app.use(router);

io.on('connection',(socket)=>{
  console.log('client connected: ',socket.id)
  
  socket.join('songs-room')
  
  socket.on('disconnect',(reason)=>{
    console.log(reason)
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});
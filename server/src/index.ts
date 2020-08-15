import sourceMapSupport from "source-map-support";

import http from 'http';
import express from "express";
import bodyParser from "body-parser";
import socketIO from 'socket.io';

sourceMapSupport.install();
const PORT = 8080;
const app = express();
app.use(bodyParser.raw());

const server = http.createServer(app);

const io = socketIO(server);

app.get("/", (req, res) => {
  console.log("handling get");
  return res.send("Hello World!");
});

let interval: any = null;

io.on("connection", (socket) => {
  console.log("New client connected");
  
  // socket.on('join', (data) => {
    
  //   socket.join(data);
  // })

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket: any) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

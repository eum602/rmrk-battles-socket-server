const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);

  // handle the event sent with socket.emit()
  socket.on("generalNftsRoom", (nftId) => {
    console.log("message received from 'generalNftsRoom'", nftId);
    //verify the kind of bird this nft is
    //pull kind of bird
    let kindOfBird = "Founder" //must be dymamically obtained
    socket.emit(kindOfBird, nftId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("challengeRoom", (sender, challenged) => {
      if(sender == null || sender =='') return
      if(challenged == null || challenged =='') return
      socket.emit(challenged, sender)
  });

  //advises an initial challenger that a challenged person has accepted or not
  socket.on("acceptChallengeRoom", (hasAccepted,challenged, challenger) => {
    if(challenged == null || challenged =='') return
    if(challenger == null || challenger =='') return
    socket.emit(challenger+"acceptRoom", challenged, hasAccepted)
  });

  //the relayer for all the messages which goes through a live play
  socket.on("matchRelayer", (message,sender, receiver) => {
    if(message == null || message =='') return //validate message, it is only a string in this stage
    if(sender == null || sender =='') return
    if(receiver == null || receiver =='') return
    socket.emit(receiver+"matchMessage", message, sender)
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  //socket.emit("GeneralRoom", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
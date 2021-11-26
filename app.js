const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require('cors')

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);
app.use(cors({
  origin: '*'
}));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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
    socket.broadcast.emit(kindOfBird, nftId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("challengeRoom", (sender, challenged) => {
    console.log("ChallengeRoom: sender: ",sender, ", challenged: ", challenged )
    if(sender == null || sender =='') return
    if(challenged == null || challenged =='') return
    socket.broadcast.emit(challenged, sender)
  });

  //advises an initial challenger that a challenged nft has accepted or not
  socket.on("acceptChallengeRoom", (hasAccepted,challenged, challenger) => {
    if(challenged == null || challenged =='') return
    if(challenger == null || challenger =='') return
    socket.broadcast.emit(challenger+"acceptRoom", challenged, hasAccepted)
  });

  //the relayer for all the messages which goes through a live play
  socket.on("matchRelayer", (message,sender, receiver) => {
    if(message == null || message =='') return //validate message, it is only a string in this stage
    if(sender == null || sender =='') return
    if(receiver == null || receiver =='') return
    socket.broadcast.emit(receiver+"matchMessage", message, sender)
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  //socket.emit("GeneralRoom", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
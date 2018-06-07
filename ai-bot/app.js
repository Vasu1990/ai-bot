const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const apiai = require("apiai")("047f0ef4a693466aa9a808fa14a89170");


const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
    console.log("New client connected");


    socket.on("chatMessage",  data => {
      console.log(data);

      let apiaiReq = apiai.textRequest(data, {
        sessionId: "APIAI_SESSION_ID"
      });
  
      apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        socket.emit('bot reply', aiText); // Send the result back to the browser!
      });
  
      apiaiReq.on('error', (error) => {
        socket.emit('bot reply', eroror); // Send the result back to the browser!
      });
  
      apiaiReq.end()
    });

    
  });

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/PUT_YOUR_API_KEY_HERE/43.7695,11.2558"
    );
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    socket.emit("FromAPI", "Error fetching data");
    console.error(`Error: ${error}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));
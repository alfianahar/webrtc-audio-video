const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const https = require("https");
const fs = require("fs");
const SimplePeerServer = require("simple-peer-server");
const cors = require("cors");
const app = express();

app.use(cors());

const port = process.env.PORT || 8081;
const address = process.env.ADDRESS;

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Create an HTTPS server
const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running on ${address}:${port}`);
});

async function createSimplePeerServer() {
  const options = {
    config: {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    },
  };

  const simplePeerServer = new SimplePeerServer(server, true, options);
}

createSimplePeerServer();

const express = require("express");
const app = express();
const path = require("path");
//using environment variables
require("dotenv").config();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const ws_port = process.env.WS_PORT || 3002;
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");

//middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(bodyParser.json());

const user = {
  username: "testUser",
  name: "Test User",
  id: 1,
  password: "test",
};

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({
  verifyClient: (info, callback) => {
    console.log("Parsing session from request...");
    console.log(info.req.headers);
    const token = info.req.headers.token;
    console.log(`Token: ${token}`);

    if (!token) {
      callback(false, 401, "Unauthorized");
    } else {
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          callback(false, 401, "Unauthorized");
        } else {
          console.log("Successfully parsed session!");
          const userToAuthorize = decoded;

          if (
            userToAuthorize.username !== user.username ||
            userToAuthorize.password !== user.password
          ) {
            callback(false, 401, "Unauthorized");
            return;
          }

          info.req.user = decoded;
          callback(true);
        }
      });
    }
  },
  port: ws_port,
  autoAcceptConnections: false,
});

wss.on("connection", (ws, req) => {
  console.log("Client connected");

  const user = req.user;

  ws.send("Hello " + user.name);

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("message", (data) => {
    console.log("Message received: " + data);
    ws.send("Hello from server");
  });
});

app.listen(port, () => {
  //assigning user_fr to user with no password
  const user_fr = { ...user };
  delete user_fr.password;

  const token = jsonwebtoken.sign(user_fr, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  console.info("Token: " + token);
  console.info("Server listening on port " + port + " ...");
});

//start ws server
wss.on("listening", () => {
  console.log("Websocket server listening on port " + ws_port + " ...");
});

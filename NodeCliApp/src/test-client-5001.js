const { io } = require("socket.io-client");

const socket = io("http://localhost:5001", {
  auth: {
    token: "YOUR_VALID_TOKEN"
  }
});

socket.on("connect", () => {
  console.log("CLIENT B connected:", socket.id);
});

socket.on("test:message", (data) => {
  console.log("CLIENT B RECEIVED:", data);
});
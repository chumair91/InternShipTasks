const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "YOUR_VALID_TOKEN"
  }
});

socket.on("connect", () => {
  console.log("CLIENT A connected:", socket.id);

  setTimeout(() => {
    socket.emit("test:message", {
      text: "Hello from client A"
    });
  }, 2000);
});

socket.on("test:message", (data) => {
  console.log("CLIENT A RECEIVED:", data);
});
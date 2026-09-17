import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
const port = 3000;
app.get("/", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.emit("welcome", `welcome to server ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);
  socket.on("disconnect", () => {
    console.log(`User with Id: ${socket.id} disconnected`);
  });

  socket.on("message", ({ message, room }) => {
    console.log(message, room);
    if (room) {
      io.to(room).emit("received-msg", { message, id: socket.id });
    } else {
      io.emit("received-msg", message);
    }
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("user", socket.id, "joined", room);
  });
});

server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

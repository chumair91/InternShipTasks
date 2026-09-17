import { io } from "socket.io-client";
import { config } from "./config";

const socket = io(config.socketUrl, {
//  const socket = io('http://localhost:5000', {
  autoConnect: false,
});

export default socket;

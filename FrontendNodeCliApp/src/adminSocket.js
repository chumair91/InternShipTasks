import { io } from "socket.io-client";
import { config } from "./config";

const adminSocket = io(`${config.socketUrl}/admin`, {
// const adminSocket = io(`http:/admin`, {
  autoConnect: false,
});
export default adminSocket;

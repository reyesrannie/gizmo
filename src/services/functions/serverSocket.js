import io from "socket.io-client";
const socket = io?.connect("http://92.204.129.55:3001");
// const socket = io?.connect("http://10.10.10.16:3001");

export default socket;

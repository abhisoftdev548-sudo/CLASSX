import http from "node:http";
import app from "./src/app.js";
import { initSocket } from "./src/socketHandler.js";
const port = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);
server.listen(port, ()=>{console.log(`Server is running on port ${port}`)});
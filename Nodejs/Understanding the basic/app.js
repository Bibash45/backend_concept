import http from "http";
import { requestHandler } from "./routes.js";
const Port = 3000;
http
  .createServer((req, res) => {
    requestHandler(req, res);
  })
  .listen(Port, () => {
    console.log(`Server running on http://localhost:${Port}`);
  });

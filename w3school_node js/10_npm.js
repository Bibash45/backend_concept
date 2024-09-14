// npm install upper-case
import uc from "upper-case";
import http from "http";
import fs from "fs";

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(uc.upperCase("Hello world"));
    console.log(`server started`);
    
    return res.end()
  })
  .listen(8080);

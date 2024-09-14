import http from "http";
import url from "url";
import fs from "fs";

http
  .createServer((req, res) => {
    var q = url.parse(req.url, true);
    var filename = "./htmlFolder/" + q.pathname;
    fs.readFile(filename, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("404 Not Found");
        return res.end();
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  })
  .listen(8080);

console.log("Server running at http://localhost:8080/");

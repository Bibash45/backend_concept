// const http = require('http');
// const formidable = require('formidable');
// const fs = require('fs');
import http from "http";
import {IncomingForm} from "formidable";
import fs from "fs";

http
  .createServer((req, res) => {
    if (req.url == "/fileupload") {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Error", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error parsing the file");
          return;
        }

        const oldPath = files.filetoupload.filepath;
        const newPath = "./file" + files.filetoupload.originalFilename;

        console.log("Old Path:", oldPath);
        console.log("New Path:", newPath);

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error("Error", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error moving the file");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("File uploaded and moved!");
        });
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="filetoupload"><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      return res.end();
    }
  })
  .listen(8080);

console.log("Server running at http://localhost:8080/");

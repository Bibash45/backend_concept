import http from "http";
import url from "url"
import fs from "fs";

//create a server object:
http
  .createServer(function (req, res) {
    res.writeHead(200,{
        'Content-Type':'text/html'
    })
    let q = url.parse(req.url,true).query;
    let txt = q.year + " " + q.month;
    res.write(txt); 
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080

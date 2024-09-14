import fs from "fs";

let rs = fs.createReadStream("./file/mynewfile2.txt");
rs.on("open", () => {
  console.log(`File is open`);
});

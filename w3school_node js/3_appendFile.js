import fs from "fs";

const folderPath = "./file"
fs.appendFile(`${folderPath}/mynewfile1.txt`, "I am ram!", (err) => {
  if (err) throw err;
  console.log("Saved");
})

import fs from "fs";

const folderPath = "./file"
fs.writeFile(`${folderPath}/mynewfile2.txt`, "", (err) => {
  if (err) throw err;
  console.log("Saved");
})

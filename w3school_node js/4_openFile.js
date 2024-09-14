import fs from "fs";

const folderPath = "./file"
fs.open(`${folderPath}/mynewfile2.txt`, "w", (err) => {
  if (err) throw err;
  console.log("Saved");
})

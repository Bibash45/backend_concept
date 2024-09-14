import fs from "fs"

const filePath = "./file"
fs.rename(`${filePath}/mynewfile1.txt`,`${filePath}/mynewfile3.txt`,(err)=>{
    if(err) throw err;
    console.log('File rename');
    
})
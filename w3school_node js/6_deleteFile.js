import fs from "fs"

const filePath = "./file"
fs.unlink(`${filePath}/log.txt`,(err)=>{
    if(err) throw err;
    console.log('File delete');
    
})
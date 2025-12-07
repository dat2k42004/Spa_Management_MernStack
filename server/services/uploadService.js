import fs from "fs";

const deleteFile = (filePath) => {
     if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
     }
}

const deleteFiles = (filePaths) => {
     filePaths.length !== 0 && filePaths.forEach(filePath => {
          deleteFile(filePath);
     })
}

export {
     deleteFile,
     deleteFiles,
}
const fs = require('fs');
const uuidV4 = require('uuid');
const multipart = require('connect-multiparty');
const path = require('path');

const osTempDir = require('os').tmpdir();
const tempDir = osTempDir + '/uploads';

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}
const multipartMiddleware = multipart({uploadDir: tempDir});

const checkTempFolder = (req, res, next) => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  next();
};

const prepareTempFolder = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  clearFolder(tempDir);
};

const clearFolder = (tempDir) => {
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) {
          console.log(file, err);
        }
      });
    }
  });
};

const getFileExtension = (filename) => {
  let ext = /^.+\.([^.]+)$/.exec(filename);
  return ext === null ? '' : ext[1];
};

const removeFile = (filePath) => {
  fs.unlinkSync(filePath, err => {
    if (err) {
      console.log(file, err);
    }
  });
};


function getFileName(path) {
  let fileName;
  if (path) {
    let fileExtension = getFileExtension(path);
    fileName = fileExtension === '' ? uuidV4() : uuidV4() + '.' + fileExtension;
  }
  return fileName;
}

prepareTempFolder();

exports.multipartMiddleware = multipartMiddleware;
exports.getFileExtension = getFileExtension;
exports.prepareTempFolder = prepareTempFolder;
exports.getFileName = getFileName;
exports.checkTempFolder = checkTempFolder;
exports.removeFile = removeFile;
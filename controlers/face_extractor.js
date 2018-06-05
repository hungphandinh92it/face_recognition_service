const {fr} = require('./commons');
const face_detector = require('./face_dectector');
const path = require('path');
const fs = require('fs');
const fileUtils = require('./fileUtils');
const DATA_DIR_TOTAL = require('../config/config').DATA_DIR_TOTAL;

const extractImgs = (files, classifierId) => {
  return new Promise((resolve, reject) => {
    try {
      let dirPath = path.resolve(DATA_DIR_TOTAL, classifierId);
      let currentFilesNumber = fs.readdirSync(dirPath).length;
      console.log('currentFilesNumber:', currentFilesNumber);
      let isArray = (data) => {
        return (Object.prototype.toString.call(data) === '[object Array]');
      };

      let totalImgsExtracted = [];
      if (!isArray(files)) {
        files = [files];
      }
      console.log('Start Extract:%s files', files.length);
      if (isArray(files)) {
        for (let i = 0; i < files.length; i++) {
          let filePath = files[i].path;
          let image = fr.loadImage(filePath);
          fileUtils.removeFile(filePath);
          if (image) {
            console.log('ImageLoaded');
          }

          // resize image if too large
          const minPxSize = 640;
          if ((image.rows) > minPxSize) {
            image = fr.resizeImage(image, minPxSize / (image.rows))
          }

          console.log('Extracting file:%s/%s', i, files.length);
          let faceImgs = face_detector.getFaceImgs(image);
          console.log('Total Faces Extract:', faceImgs.length);
          if (faceImgs.length) {
            totalImgsExtracted = [...totalImgsExtracted, ...faceImgs];
          }
        }
      } else {
        let filePath = files.path;
        let image = fr.loadImage(filePath);
        if (image) {
          console.log('ImageLoaded');
        }

        // resize image if too large
        const minPxSize = 640;
        if ((image.rows) > minPxSize) {
          image = fr.resizeImage(image, minPxSize / (image.rows))
        }

        console.log('Extracting file:%s/%s', 1, files.length);
        let faceImgs = face_detector.getFaceImgs(image);
        console.log('Total Faces Extract:', faceImgs.length);
        if (faceImgs.length) {
          totalImgsExtracted = [...totalImgsExtracted, ...faceImgs];
        }
      }
      console.log('Total Images', totalImgsExtracted.length);
      totalImgsExtracted.forEach((image, i) => {
        console.log('Saving file:%s/%s', i, files.length);
        fr.saveImage(path.resolve(dirPath, `${classifierId}_${currentFilesNumber + i}.png`), image);
      });
      resolve()
    } catch (e) {
      reject(e);
    }
  })
};

exports.extractImgs = extractImgs;

const extractAndSaveImg = (img, dirPath) => {
  let faceImgs = face_detector.getFaceImgs(img);
  faceImgs.forEach((image, i) => {
    fr.saveImage(path.resolve(dirPath, `face_${i}.png`), image);
  });
};
exports.extractAndSaveImg = extractAndSaveImg;
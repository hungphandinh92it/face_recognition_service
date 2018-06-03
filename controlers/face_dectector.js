const {fr} = require('./commons');
const detector = fr.FaceDetector();
const frontalDetector = new fr.FrontalFaceDetector();
const config = require('../config/config');

const getFaceImgs = (image) => {
  const minPxSize = 640;
  if ((image.rows) > minPxSize) {
    image = fr.resizeImage(image, minPxSize / (image.rows))
  }
  return detector.detectFaces(image, config.FACE_IMAGE_SIZE);
  // return getFaceRects(img);
};

const getFaceRects = (img) => {
  console.log('Start detect');
  const faceRects = frontalDetector.detect(img);
  console.log('Done detect: ', faceRects.length);
  return detector.getFacesFromLocations(img, faceRects, config.FACE_IMAGE_SIZE);
};

const getRects = (img) => {
  console.log('Start detect');
  const faceRects = frontalDetector.detect(img);
  console.log('Done detect: ', faceRects.length);
  return faceRects;
};

// exports.getFaceImgs = getFaceImgs;
exports.getFaceImgs = getFaceRects;
exports.getFaceRects = getFaceRects;
exports.getRects = getRects;

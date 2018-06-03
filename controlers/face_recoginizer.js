const path = require('path');
const {fr} = require('./commons');
const {recognizer} = require('./commons');
const fs = require('fs');
const utils = require('./utils');
const responseAction = require('./responseAction');
const config = require('../config/config');
const shell = require('shelljs');
const face_detector = require('./face_dectector');
require('./logUtils');

const {
  drawRects,
  getAppdataPath,
  ensureAppdataDirExists
} = require('./commons');

const detector = fr.FaceDetector();

const join = (dirPath, name) => path.join(dirPath, name);

const loadModel = () => {
  console.log("Loading model...");
  let modelPath = './data/model/model.json';
  if (!fs.existsSync(modelPath)) {
    return console.log('Not train yet');
  }
  modelPath = '../data/model/model';
  const modelState = require(modelPath);
  recognizer.load(modelState);
  console.log("Model has loaded");
  console.log(JSON.stringify(recognizer.getDescriptorState(), null, 2));
  return recognizer;
};
exports.loadModel = loadModel;

const predictImageFile = (req, res) => {
  new Promise((resolve, reject) => {
    // loadModel();
    // console.log(JSON.stringify(req.body, null, 2));
    console.log("Predicting");
    try {
      let files = req.files.files;
      let file = files.path;
      console.log('Loading Image:', file);
      let image = fr.loadImage(file);

      // resize image if too large
      const maxPxSize = 640;
      if ((image.rows) > maxPxSize) {
        image = fr.resizeImage(image, maxPxSize / (image.rows))
      }

      // resize image if too small
      // const minPxSize = 90000;
      // if ((image.cols * image.rows) < minPxSize) {
      //   image = fr.resizeImage(image, minPxSize / (image.cols * image.rows))
      // }
      console.log('Get Face Image:', file);
      let face = face_detector.getFaceRects(image)[0];
      console.log('Predict Image:', file);
      // const predictions = recognizer.predict(face);
      const predictions = recognizer.predictBest(face, 0.7);
      console.log('Result:', JSON.stringify(predictions));
      resolve(predictions);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
    .then(predictions => {
      responseAction.success(res, predictions);
    })
    .catch(e => {
      responseAction.error(res, e);
    })

};

const predictImage = (req, res) => {
  new Promise((resolve, reject) => {
    // loadModel();
    console.log("Predicting");
    try {
      // console.log('Loading Image:', req.body);
      console.log(JSON.stringify(req.body, null, 2));
      // var decodedImage = new Buffer(req.body.files, 'base64').toString('binary');
      let image = req.body.image;
      // resize image if too small
      // const minPxSize = 90000;
      // if ((image.cols * image.rows) < minPxSize) {
      //   image = fr.resizeImage(image, minPxSize / (image.cols * image.rows))
      // }
      // console.log('Get Face Image:', file);
      let face = face_detector.getFaceImgs(image)[0];
      // console.log('Predict Image:', file);
      const predictions = recognizer.predict(face);
      // const predictions = recognizer.predictBest(face);
      console.log('Result:', JSON.stringify(predictions));
      resolve(predictions);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
    .then(predictions => {
      responseAction.success(res, predictions);
    })
    .catch(e => {
      responseAction.error(res, e);
    })

};


const predictImageAndShow = (req, res) => {
  new Promise((resolve, reject) => {
    // loadModel();
    console.log("Predicting");
    try {
      let files = req.files.files;
      let file = files.path;
      console.log('Loading Image:', file);
      let image = fr.loadImage(file);
      // resize image if too small
      const minPxSize = 640;
      if ((image.rows) > minPxSize) {
        image = fr.resizeImage(image, minPxSize / (image.rows))
      }
      console.log('Get Face Image:', file);
      let img = image;
      console.log('detecting faces for query image')
      // const faceRects = detector.locateFaces(img).map(res => res.rect)
      const faceRects = face_detector.getRects(img);
      console.log('located: %s', faceRects.length, ' faces');
      const faces = detector.getFacesFromLocations(img, faceRects, config.FACE_IMAGE_SIZE);
      console.log('getFacesFromLocations: %s', faces.length, ' faces');

      const win = new fr.ImageWindow();
      win.setImage(img);
      drawRects(win, faceRects);
      console.log('drawRects: %s', faceRects.length, ' faces');

      // mark faces with distance > 0.6 as unknown
      const unknownThreshold = 0.6;
      let result = [];
      faceRects.forEach((rect, i) => {
        console.log('Predict face: %s', i);
        const prediction = recognizer.predictBest(faces[i], unknownThreshold);
        win.addOverlay(rect, `${prediction.className} (${prediction.distance})`);
        console.log(`${prediction.className} (${prediction.distance})`);
        result.push(`${prediction.className} (${prediction.distance})`);
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  })
    .then(predictions => {
      responseAction.success(res, predictions);
    })
    .catch(e => {
      responseAction.error(res, e);
    })
};

const predictImageBase64 = (req, res) => {
  new Promise((resolve, reject) => {
    // loadModel();
    console.log("Predicting");
    try {
      // console.log('Loading Image:', req.body);
      console.log(JSON.stringify(req.body, null, 2));
      // var base = req.body.replace(/-/g, '+').replace(/_/g, '/').replace(/ /g, '+');
      // var decodedImage = new Buffer(base, 'base64').toString('binary');
      let image = req.file;
      // resize image if too small
      // const minPxSize = 90000;
      // if ((image.cols * image.rows) < minPxSize) {
      //   image = fr.resizeImage(image, minPxSize / (image.cols * image.rows))
      // }
      // console.log('Get Face Image:', file);
      let face = face_detector.getFaceImgs(image)[0];
      // console.log('Predict Image:', file);
      const predictions = recognizer.predict(face);
      // const predictions = recognizer.predictBest(face);
      console.log('Result:', JSON.stringify(predictions));
      resolve(predictions);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
    .then(predictions => {
      responseAction.success(res, predictions);
    })
    .catch(e => {
      responseAction.error(res, e);
    })

};

exports.predictImage = predictImage;
exports.predictImageAndShow = predictImageAndShow;
exports.predictImageFile = predictImageFile;
exports.predictImageBase64 = predictImageBase64;
const path = require('path');
const fr = require('face-recognition');
const utils = require('./utils');
const responseAction = require('./responseAction');
const face_extractor = require('./face_extractor');
const face_trainner = require('./face_trainner');

const DATA_DIR_TOTAL = require('../config/config').DATA_DIR_TOTAL;

exports.createClassifier = (req, res) => {
  let newClassId = req.body.id;
  if (!utils.isExist(newClassId)) {
    utils.createClass(newClassId);
  }
  responseAction.success(res, newClassId);
};

const getHashClassifier = (classifierId) => utils.hashStr(classifierId);

exports.updateClassifier = (req, res) => {
  let isArray = (data) => {
    return (Object.prototype.toString.call(data) === '[object Array]');
  };
  let classifierId = req.params.id;
  if (!utils.isExist(classifierId)) {
    return responseAction.error(res, "Please create classifier first!");
  }
  let hashClassifier = getHashClassifier(classifierId);
  let files = req.files.files;
  if (!files) {
    return responseAction.error(res, "No thing to update, please attach the files");
  }
  face_extractor.extractImgs(files, hashClassifier)
    .then(() => {
      if (isArray(files)) {
        responseAction.success(res, "Upload success: " + files.length + " files");
        console.log('Uploaded all files');
      } else {
        responseAction.success(res, "Upload success: " + 1 + " files");
        console.log('Uploaded 1 file');
      }
    })
    .catch(e => {
      console.log(e);
      responseAction.error(res, e);
    });
};


const createAndTrain = (req, res) => {
  let newClassId = req.body.id;
  if (!utils.isExist(newClassId)) {
    utils.createClass(newClassId);
  }

  let isArray = (data) => {
    return (Object.prototype.toString.call(data) === '[object Array]');
  };
  let classifierId = newClassId;
  if (!utils.isExist(classifierId)) {
    return responseAction.error(res, "Please create classifier first!");
  }
  let hashClassifier = getHashClassifier(classifierId);
  let files = req.files.files;
  if (!files) {
    return responseAction.error(res, "No thing to update, please attach the files");
  }
  face_extractor.extractImgs(files, hashClassifier)
    .then(() => {
      face_trainner.trainOneThenSave(hashClassifier)
        .then((result) => {
          responseAction.success(res, result);
        })
        .catch(e => {
          responseAction.success(res, e);
        })
    })
    .catch(e => {
      console.log(e);
      responseAction.error(res, e);
    });

};

exports.createAndTrain = createAndTrain;

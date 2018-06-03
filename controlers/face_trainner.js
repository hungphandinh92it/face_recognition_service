const path = require('path');
const {fr} = require('./commons');
const fs = require('fs');
const utils = require('./utils');
const face_recoginizer = require('./face_recoginizer');
const responseAction = require('./responseAction');
const config = require('../config/config');
const {recognizer} = require('./commons');
const shell = require('shelljs');

const trainAllFileInDir = (dataPath, classiferId) => {
  const numJitters = config.NUMBER_OF_JITTER;
  const allFiles = fs.readdirSync(dataPath);
  console.log('Start train: %s : %s images', classiferId, allFiles.length);
  let allFaces = allFiles
    .map(f => path.join(dataPath, f))
    .map(fp => {
      console.log("Train image:", fp);
      return fr.loadImage(fp);
    });
  // recognizer.addFaces(allFaces, classiferId, numJitters);
  recognizer.addFaces(allFaces, classiferId);
  console.log('Trained: %s : %s images', classiferId, allFaces.length);
};

const join = (dirPath, name) => path.join(dirPath, name);

const trainAllDataDir = (dataDir) => {
  let subDataDirs = fs.readdirSync(dataDir);
  subDataDirs
    .filter(fileName => fs.statSync(join(dataDir, fileName)).isDirectory())
    .forEach(fileName => {
      let classifierId = fileName;
      let oneDir = join(dataDir, fileName);
      trainAllFileInDir(oneDir, classifierId);
    });
};

const saveModel = () => {
  const modelState = recognizer.serialize();
  if (!fs.existsSync(config.DATA_MODEL)) {
    shell.mkdir('-p', config.DATA_MODEL);
  }
  let modelPath = join(config.DATA_MODEL, 'model.json');
  fs.writeFileSync(modelPath, JSON.stringify(modelState))
};

const trainAllAndSave = () => {
  return new Promise((resolve, reject) => {
    try {
      // let negativeDir = config.DATA_DIR_NEGATIVE;
      // trainAllDataDir(negativeDir);
      let trainDir = config.DATA_DIR_TOTAL;
      trainAllDataDir(trainDir);
      saveModel();
      console.log(JSON.stringify(recognizer.getDescriptorState(), null, 2));
      resolve(recognizer.getDescriptorState());
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
};

const trainAll = (req, res) => {
  console.log('Start train data');
  trainAllAndSave()
    .then((result) => {
      responseAction.success(res, result);
    })
    .catch(e => {
      responseAction.success(res, e);
    })
};

const trainOneThenSave = (classifierId) => {
  return new Promise((resolve, reject) => {
    try {
      // face_recoginizer.loadModel();
      console.log(JSON.stringify(recognizer.getDescriptorState(), null, 2));
      let trainDir = config.DATA_DIR_TOTAL;
      let oneDir = join(trainDir, classifierId);
      trainAllFileInDir(oneDir, classifierId);
      saveModel();
      console.log(JSON.stringify(recognizer.getDescriptorState(), null, 2));
      resolve(recognizer.getDescriptorState());
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
};

const trainById = (req, res) => {
  console.log('trainById', req.params.id);
  trainOneThenSave(req.params.id)
    .then((result) => {
      responseAction.success(res, result);
    })
    .catch(e => {
      responseAction.success(res, e);
    })
};

const getTrainState = (req, res) => {
  // face_recoginizer.loadModel();
  console.log(JSON.stringify(recognizer.getDescriptorState(), null, 2));
  responseAction.success(res, recognizer.getDescriptorState());
};

exports.getTrainState = getTrainState;

exports.getTrainStateById = (req, res) => {
  let id = req.params.id;
};

exports.trainAll = trainAll;
exports.trainById = trainById;
exports.trainOneThenSave = trainOneThenSave;
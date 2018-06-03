const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const DATA_DIR_TOTAL = require('../config/config').DATA_DIR_TOTAL;

const hashStr = (str) => {
  return str;
};

exports.isExist = (newClassId) => {
  let hashClass = hashStr(newClassId);
  console.log(DATA_DIR_TOTAL, hashClass);
  let classPath = path.resolve(DATA_DIR_TOTAL, hashClass);
  return fs.existsSync(classPath);
};

const createClass = (newClassId) => {
  let hashClass = hashStr(newClassId);
  let classPath = path.resolve(DATA_DIR_TOTAL, hashClass);
  if (!fs.existsSync(classPath)) {
    shell.mkdir('-p', classPath);
    // fs.mkdirSync(classPath);
  }
  return hashClass;
};

exports.createClass = createClass;
exports.hashStr = hashStr;
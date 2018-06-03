var express = require('express');
var router = express.Router();
var face_recoginizer = require('../controlers/face_recoginizer');
const fileUtils = require('../controlers/fileUtils');
router.post('/show', fileUtils.checkTempFolder, fileUtils.multipartMiddleware, face_recoginizer.predictImageAndShow);
router.post('/file', fileUtils.checkTempFolder, fileUtils.multipartMiddleware, face_recoginizer.predictImageFile);
router.post('/image', face_recoginizer.predictImageBase64);
router.post('/', face_recoginizer.predictImage);


module.exports = router;

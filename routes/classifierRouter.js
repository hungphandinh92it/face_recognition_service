const express = require('express');
const router = express.Router();
const classifierCtrl = require('../controlers/classifierCtrl');
const fileUtils = require('../controlers/fileUtils');

router.post('/', classifierCtrl.createClassifier);
router.post('/train', fileUtils.checkTempFolder, fileUtils.multipartMiddleware, classifierCtrl.createAndTrain);
router.put('/:id', fileUtils.checkTempFolder, fileUtils.multipartMiddleware, classifierCtrl.updateClassifier);

module.exports = router;

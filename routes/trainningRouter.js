var express = require('express');
var router = express.Router();
var face_trainner = require('../controlers/face_trainner');

router.post('/', face_trainner.trainAll);
router.put('/:id', face_trainner.trainById);
router.get('/', face_trainner.getTrainState);
router.get('/:id', face_trainner.getTrainStateById);

module.exports = router;

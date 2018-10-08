'use strict';

var express = require('express');
var router = express.Router();

var jsonList = require('../controllers/jsonController')

router.post('/json/submit', jsonList.submitBlob)
router.get('/json/read-by-key', jsonList.readBlobByKey)
router.get('/json/read-by-tuple', jsonList.readBlobByTuple)
router.get('/json/chunk/read-by-key', jsonList.readBlobChunkByKey)
router.get('/json/chunk/read-by-tuple', jsonList.readBlobChunkByTuple)

module.exports = router;    
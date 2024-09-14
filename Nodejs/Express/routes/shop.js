const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const {getProduct} = require('../controllers/products.js');

const router = express.Router();

router.get('/',getProduct);

module.exports = router;

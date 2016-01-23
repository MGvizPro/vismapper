//Import express
var express = require('express');
var router = express.Router();

//Import libs
var Clean = require('../lib/clean.js');

//Index
router.get('/', Clean, function(req, res, next){

	res.render('index', { title: 'Home' });

});

//Exports to node
module.exports = router;

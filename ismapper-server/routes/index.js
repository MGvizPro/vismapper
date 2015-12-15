//Import express
var express = require('express');
var router = express.Router();

//Index
router.get('/', function(req, res, next){
	
	res.render('index', { title: 'Home' });
	
});

//Exports to node
module.exports = router;
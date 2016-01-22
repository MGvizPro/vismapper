//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var multer  = require('multer');

//Import libs
var ProjectCreate = require('../lib/project-create.js');

//Import config
var Config = require('../../ismapper-config.json');


//Configure for file uploads
var ufile = multer({ dest: Config.uploads }).single('ufile');


//Upload
router.get('/upload', function(req, res, next){

	//Render the upload
	res.render('upload', { title: 'Upload', error: '' });

});

//Upload post
router.post('/upload', ufile, ProjectCreate);


//Exports to node
module.exports = router;

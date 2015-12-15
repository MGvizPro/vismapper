//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var multer  = require('multer');
var CreateProject = require('../lib/create-project');

//Import config
var Config = require('../../ismapper-config.json');


//Configure for file uploads
var ufile = multer({ dest: Config.paths.uploads }).single('ufile');


//Upload
router.get('/upload', function(req, res, next){

	//Render the upload
	res.render('upload', { title: 'Upload', error: '' });

});

//Upload post
router.post('/upload', ufile, CreateProject);


//Exports to node
module.exports = router;

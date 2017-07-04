//Import dependencies
var express = require('express');
var multer  = require('multer');

//Import libs
var project = require('../lib/project.js');

//Import config
var ISConfig = require('../../ismapper-config.json');

//Configure for file uploads
var ufile = multer({ dest: ISConfig.uploads }).single('ufile');

//Initialize the express route
var router = express.Router();

//Render the upload page
router.get('/upload', function(req, res)
{
  //Render the upload page
  res.render('upload', { title: 'Upload', error: '' });
});

//Upload post
router.post('/upload', ufile, function(req, res)
{
  //Initialize the project options
  var opt = {};

  //Parse the email
  opt.email = (typeof req.body.uemail !== 'undefined' && req.body.uemail) ? req.body.uemail : 'null';

  //Parse the title
  opt.title = (typeof req.body.utitle !== 'undefined' && req.body.utitle) ? req.body.utitle : 'Untitled';

  //Parse the aligner
  opt.aligner = (typeof req.body.ualigner !== 'undefined' && req.body.ualigner) ? req.body.ualigner : 'bwa';

  //Parse the specie
  opt.specie = (typeof req.body.uspecie !== 'undefined' && req.body.uspecie) ? req.body.uspecie : 'hsapiens/grch38';

  //Parse the mapping quality
  opt.quality = (typeof req.body.uquality !== 'undefined' && req.body.uquality) ? parseInt(req.body.uquality) : 20;

  //Create the project
  return project.create(req.file, opt, function(error, id)
  {
    //check the error
    if(error)
    {
      //Render the error page
      return res.render('upload', { title: 'Upload', error: error.message });
    }

    //Redirect to the project sttus page
    return res.redirect('/project/' + id);
  });
});

//Exports to node
module.exports = router;

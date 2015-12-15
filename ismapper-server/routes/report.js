//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var db = require('dosql');
var SetJson = require('../lib/set-json.js');
var ShowJson = require('../lib/show-json.js');

//Import sections
var MakeReport = require('../lib/make-report.js');
var DownloadReport = require('../lib/download-report.js');
var CheckProject = require('../lib/check-project.js');

//Report root
router.get('/report', function(req, res, next){ res.redirect('/'); });

//Report with ID
router.get('/report/:id', CheckProject, function(req, res, next){

	//Save the options
	var options = {title: 'Report', projectId: req.result.id, projectTitle: req.result.title};

	//Show report dashboard
	res.render('report', options);

});

//Generate the report
router.get('/report/:project/get', SetJson, MakeReport, ShowJson);

//Download the report
router.get('/report/:project/download', MakeReport, DownloadReport);

//Exports to node
module.exports = router;

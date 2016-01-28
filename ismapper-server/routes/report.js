//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var db = require('dosql');
var path = require('path');
var resJson = require('../lib/utils/res-json.js');

//Import sections
var ReportMake = require('../lib/report-make.js');
var ReportDownload = require('../lib/report-download.js');
var Status = require('../lib/status.js');

//Import config
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Report root
router.get('/report', function(req, res, next){ res.redirect('/'); });

//Report with ID
router.get('/report/:id', Status, function(req, res, next){

	//Save the options
	var options = {title: 'Report', projectId: req.result.id, projectTitle: req.result.title};

	//Show report dashboard
	res.render('report', options);

});

//Generate the report
router.get('/report/:project/get', resJson.Set, ReportMake, resJson.Show);

//Download the report
router.get('/report/:project/download', Status, ReportMake, ReportDownload);

//Download the sam file
router.get('/report/:id/sam', Status, function(req, res, next){

	//Get the ID
	var id = req.params.id;

	//Get the file
	var sam = path.join(ISConfig.uploads, id + '/output.sam');

	//Download the file
	res.download(sam);

});

//Exports to node
module.exports = router;

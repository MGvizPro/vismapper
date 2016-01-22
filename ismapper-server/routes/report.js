//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var db = require('dosql');
var resJson = require('../lib/utils/res-json.js');

//Import sections
var ReportMake = require('../lib/report-make.js');
var ReportDownload = require('../lib/report-download.js');
var Status = require('../lib/status.js');

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
router.get('/report/:project/download', ReportMake, ReportDownload);

//Exports to node
module.exports = router;

//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var db = require('dosql');

//Import sections
var Status = require('../lib/status.js');
var Days = require('../lib/utils/days.js');

//Import configs
var Config = require('../config.json');

//Project root
router.get('/project', function(req, res, next){ res.redirect('/'); });

//Project with ID
router.get('/project/:id', Status, function(req, res, next){

	//Get the project ID
	var id = req.params.id;

	//Check if project is successful created
	if(req.result.ready > 0)
	{
		//Get the remaining days
		var days = Days.Remaining(req.result.date, Config.time.extend);

		//Save the options
		var options = {title: 'Dashboard', projectId: req.result.id, projectTitle: req.result.title, projectDays: days};

		//Show project dashboard
		res.render('project/dashboard', options);
	}
	else
	{
		//Wait
		res.render('project/status', {title: 'Status', projectId: req.result.id, refresh: Config.refresh });
	}

});

//For extend the project life
router.get('/project/:id/extend', CheckProject, function(req, res, next){

	//Get the project ID
	var id = req.params.id;

	//Get project remaining days
	var days = Days.Remaining(req.result.date);

	//Check if remaining days is <= 10
	if(days <= 10)
	{
		//Extend the time
		var extend = Days.Extend(req.result.date);

		//Save
		db.Do({in: 'project', do: 'update', set: {date: extend}, where: {'id': id}}, function(results){

			//Done, go to the project page
			res.redirect('/project/' + id);

		});
	}
	else
	{
		//You can't extend the time, redirect
		res.redirect('/project/' + id);
	}

});

//Exports to node
module.exports = router;

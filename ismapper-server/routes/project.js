//Import express
var express = require('express');
var router = express.Router();

//Import dependencies
var db = require('dosql');

//Import sections
var CheckProject = require('../lib/check-project.js');

//Project root
router.get('/project', function(req, res, next){ res.redirect('/'); });

//Project with ID
router.get('/project/:id', CheckProject, function(req, res, next){

	//Check if project is successful created
	if(req.result.ready > 0)
	{
		//Save the options
		var options = {title: 'Dashboard', projectId: req.result.id, projectTitle: req.result.title};

		//Show project dashboard
		res.render('project/dashboard', options);
	}
	else
	{
		//Wait
		res.render('project/status', {title: 'Status', projectId: req.result.id });
	}
});

//Exports to node
module.exports = router;

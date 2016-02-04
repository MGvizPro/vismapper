//Import dependencies
var path = require('path');
var rimraf = require('rimraf');

//Import libs
var db = require('dosql');

//Import libs
var Days = require('./utils/days.js');

//Import config
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Function for clean the projects
function CleanProjects(req, res, next)
{
	//Remove projects array
	var remove = [];

	//Get all the projects
	db.Do({ in: 'project', do: 'select'}, function(results){

		//Get the results
		for(var i = 0; i < results.length; i++)
		{
			//Check the project demo
			if(results[i].id === Config.demo){ continue; }

			//Get the remaining days
			var days = Days.Remaining(results[i].date, Config.time.extend);

			//Check for remove
			if(days == 0)
			{
				//Add to remove
				remove.push(results[i].id);
			}
		}

		//Check for remove
		if(remove.length > 0)
		{
			//Show in console
			console.log('Remove the next projects: ');
			console.log(remove);

			//Remove all the projects
			RemoveProject(0, remove, function(){ return next(); });
		}
		else
		{
			//Show confirmation
			console.log('No projects for remove');

			//Continue
			return next();
		}

	});
}

//Function for remove the project
function RemoveProject(n, remove, callback)
{
	//Remove the project table
	db.Do({ do: 'drop table', named: remove[n]}, function(result){

		//Remove from project list
		db.Do({ in: 'project', do: 'delete', where: { id: remove[n]}}, function(result){

			//project folder
			var folder = path.join(ISConfig.uploads, remove[n] + '/');

			//Remove files from the project folder
			rimraf.sync(folder);

			//Increment the counter
			n = n + 1;

			//Check for do the callback
			if(n < remove.length)
			{
				//Remove the project
				RemoveProject(n, remove, callback);
			}
			else
			{
				//Do the callback
				callback();
			}

		});

	});
}

//Exports to node
module.exports = CleanProjects;

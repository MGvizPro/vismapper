//Import dependencies
var fs = require('fs');
var path = require('path');
var db = require('dosql');

//Import libs
var Sam = require('./lib/sam.js');
var Run = require('./lib/run.js');
var Mail = require('./lib/mail.js');

//Import config
var Config = require('./config.json');
var ISConfig = require('../ismapper-config.json');

//Initialize request client
db.Connect(ISConfig.db);

//Get the arguments
var args = process.argv.slice(2);

//Save the project ID
var id = args[0];

//Save the folder
var folder = path.join(ISConfig.uploads, id + '/');

//Time for complete the run
var time = 0;

//Mapper
var mapper = 'bwa';

//Reference genome
var reference = 'hsapiens/grch38';

//Get the project info
db.Do({ in: 'project', do: 'select', wherer: {id: id }}, function(err, results){

	//Initialize the time
	time = Date.now();

	//Run the mapper
	Run(folder, mapper, reference);

	//Get the new time
	time = Date.now() - time;

	//Show confirmation in console
	console.log('Run ' + mapper + ' in ' + time + 'ms');

	//Read the sam file
	Sam(id, folder + 'input.sam', Config.quality, function(){

		//Create the update object
		var upd = { ready: 1, time: time };

		//Update the project
		db.Do({ in: 'project', do: 'update', where: { id: id }, set: upd }, function(res){

			//Send the mail and exit
			Mail(id, function(){ process.exit(0); });

		});

	});

});

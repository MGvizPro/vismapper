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

//Get the project info
db.Do({ in: 'project', do: 'select', where: { id: id }}, function(results){

	//Initialize the time
	time = Date.now();

	//Run the aligner
	Run(folder, results[0].aligner, results[0].specie);

	//Get the new time
	time = Date.now() - time;

	//Show confirmation in console
	console.log('Run ' + results[0].aligner + ' in ' + time + 'ms');

	//Read the sam file
	Sam(id, folder + 'output.sam', Config.quality, function(num){

		//Create the update object
		var upd = { ready: 1, time: time, seq_mapp: num };

		//Update the project
		db.Do({ in: 'project', do: 'update', where: { id: id }, set: upd }, function(res){

			//Remove files
			//fs.unlinkSync(folder + 'output.sam');
			//fs.unlinkSync(folder + 'input.fastq');

			//Delete the folder
			//fs.rmdirSync(folder);

			//Send the mail and exit
			Mail(id, function(){ process.exit(0); });

		});

	});

});

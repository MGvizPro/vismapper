//Import dependencies
var fs = require('fs');
var path = require('path');
var readline = require('readline');

//Import libs
var samParse = require('./sam-parse.js');
var samInsert = require('./sam-insert.js');
var samConvert = require('./sam-convert.js');

//Function for read a SAM file
function Sam(id, file, quality, callback)
{
	//Create the interface for read the file
	var rl = readline.createInterface({ input: fs.createReadStream(file) });

	//Output array
	var data = {};

	//Chromosomes list
	var chrs = [];

	//Counter for the number of mapped sequences
	var counter = 0;

	//Read a line -> save to a file
  rl.on('line', function(line){

		//Parse the line
		line = samParse(line, quality);

		//Check for save the line
		if(line)
		{
			//Check the chromosome
			if(typeof data[line.chr] === 'undefined')
			{
				//Create the new chromosome
				data[line.chr] = [];

				//Save the chromosome name
				chrs.push(line.chr);
			}

			//Save the sam line
			data[line.chr].push(line);

			//Increment the counter
			counter = counter + 1;
		}

	});

	//End file -> do the callback
  rl.on('close', function(){

		//Check the data length
		if(data === {} || Object.keys(data).length == 0)
		{
			//do the callback
			return callback(0);
		}

		//Insert into the database
		samInsert(id, data, chrs, function(){

			//Convert sam to bam
			samConvert(file);

			//Do the callback
			callback(counter);

		});

	});
}

//Exports to node
module.exports = Sam;

//Import dependencies
var fs = require('fs');
var db = require('dosql');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var FastaTools = require('fasta-tools');

//Import config
var Config = require('../../ismapper-config.json');

//Application variables
var AppVars = require('../app.json');

//Import libs
var ExtractFile = require('./extract-file');
var GenID = require('./utils/gen-id');


//Function for create the new project
function CreateProject(req, res, next)
{
  //Get the email
	var email = (typeof req.body.uemail !== 'undefined' && req.body.uemail) ? req.body.uemail : 'null';

	//Get the title
	var title = (typeof req.body.utitle !== 'undefined' && req.body.utitle) ? req.body.utitle : 'Untitled';

	//Get the new ID
	var id = GenID();

	//Extract the file
	ExtractFile(req.file, function(error, file_path, isFQ){

		//Check for error
		if(error === true)
		{
			//Render the error page
			res.render('upload', { title: 'Upload', error: 'Error: no fasta/fastq file selected.' });

			//Exit
			return;
		}

		//Make the new dir
		mkdirp.sync(Config.server.uploads + id);

		//Change the dir permissions
		exec('chmod a+w ' + Config.server.uploads + id);

		//Check if is fastq
		if(isFQ === true)
		{
			//Set isfastq as YES
			var isfastq = 'YES';

			//Output file name
			var output = '/input.fastq';

			//Fasta format
			var fastaf = 'fastq';
		}
		else
		{
			//Set isfastq as NO
			var isfastq = 'NO';

			//Output file name
			var output = '/input.fasta';

			//Fasta format
			var fastaf = 'fasta';
		}

		//Rename the file using the new ID
		fs.rename(file_path, Config.server.uploads + id + output, function(err){

			//Validate the fasta/fastq file
			if(FastaTools.ValidateSync(Config.server.uploads + id + output, fastaf) === true)
			{

				//Create the new object for insert
				var obj = {id: id, email: email, ready: 0, title: title, date: Date.now()};

				//Create project to database
				db.Do({in: 'project', do: 'insert', values: obj}, function(results){

					//Create the command
					var command = AppVars.command;

					//Replace the script location
					command = command.replace(/{bin}/g, Config.bin.path);

					//Replace the uploads folder
					command = command.replace(/{uploads}/g, Config.server.uploads);

					//Replace the project ID
					command = command.replace(/{project}/g, id);

					//Replace if is fastQ
					command = command.replace(/{isfastq}/g, isfastq);

					//Replace the user email
					command = command.replace(/{email}/g, email);

					//Show in console the command
					console.log(command);

					//Execute the command
					exec(command);

					//Redirect
					res.redirect('/project/' + id);

				});
			}
			else
			{
				//Delete the input file
				fs.unlinkSync(Config.server.uploads + id + output);

				//Delete the folder
				fs.rmdirSync(Config.server.uploads + id);

				//Render the error page
				res.render('upload', { title: 'Upload', error: 'Error: corrupted fasta/fastq file.' });
			}

		});
	});
}

//Exports to node
module.exports = CreateProject;

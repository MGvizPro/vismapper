//Import dependencies
var fs = require('fs');
var db = require('dosql');
var mkdirp = require('mkdirp');
var FastaTools = require('fasta-tools');
var execSync = require('child_process').execSync;
var getID = require('getid');

//Import configs
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Import libs
var ProjectExtract = require('./project-extract.js');
var ProjectFasta = require('./project-fasta.js');
var ProjectRun = require('./project-run.js');
var Days = require('./utils/days.js');


//Function for create the new project
function ProjectCreate(req, res, next)
{
  //Get the email
	var email = (typeof req.body.uemail !== 'undefined' && req.body.uemail) ? req.body.uemail : 'null';

	//Get the title
	var title = (typeof req.body.utitle !== 'undefined' && req.body.utitle) ? req.body.utitle : 'Untitled';

	//Get the new ID
	var id = getID({ prefix: 'ISM' });

	//Extract the file
	var exResult = ProjectExtract(req.file);

	//Check for error
	if(exResult.error === true)
	{
		//Render the error page
		res.render('upload', { title: 'Upload', error: 'Error: no fasta/fastq file selected.' });

		//Exit
		return;
	}

	//Make the new dir
	mkdirp.sync(ISConfig.uploads + id);

	//Change the dir permissions
	execSync('chmod a+w ' + ISConfig.uploads + id);

	//Rename the file using the new ID
	fs.renameSync(exResult.path, ISConfig.uploads + id + 'input.fastq');

	//Validate the fasta/fastq file
	var faResult = ProjectFasta(ISConfig.uploads + id + 'input.fastq', exResult.type);

	//Check for error
	if(faResult === true)
	{
		//Get the expiration time
		var expire = Days.Expiration(Config.time.expire);

		//Create the new object for insert
		var obj = {id: id, email: email, ready: 0, title: title, date: expire};

		//Create the project on the database
		db.Do({in: 'project', do: 'insert', values: obj}, function(results){

			//Run the command
			ProjectRun(id);

			//Redirect
			res.redirect('/project/' + id);

		});
	}
	else
	{
		//Delete the input file
		fs.unlinkSync(ISConfig.uploads + id + output);

		//Delete the folder
		fs.rmdirSync(ISConfig.uploads + id);

		//Render the error page
		res.render('upload', { title: 'Upload', error: 'Error: corrupted fasta/fastq file.' });
	}
}

//Exports to node
module.exports = ProjectCreate;

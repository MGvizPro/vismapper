//Import dependencies
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');

//Import configs
var ISConfig = require('../../ismapper-config.json');
var Config = require('../config.json');

//Function for extract the project
function ProjectExtract(file)
{
	//Get the file path
	var file_path = file.path;

	//Get the file extension
	var ext = path.extname(file.originalname);

	//Check if file is a ZIP
	if(ext === '.zip')
	{
		//Read the zip
		var zip = new AdmZip(file.path);

		//Get all the content
		var zipcont = zip.getEntries();

		//Generate the array with the fasta formats
		var formats = Config.formats.fasta.concat(Config.formats.fasta.fastq);

		//For check if zip is ok
		var extracted = false;

		//Read the content
		for(var i = 0; i < zipcont.length; i++)
		{
			//Check if extension is any fasta format
			if(formats.indexOf(path.extname(zipcont[i].name)) > -1)
			{
				//Extract the file
				zip.extractEntryTo(zipcont[i], ISConfig.uploads, false, true);

				//Save the file path
				file_path = ISConfig.uploads + zipcont[i].name;

				//Save the extension
				ext = path.extname(zipcont[i].name);

				//Set stracted as true
				extracted = true;

				//Break
				break;
			}
		}

		//Check for error
		if(extracted === false)
		{
			//Return with an error
			return { error: true };
		}

    //Delete the zip file
		fs.unlinkSync(file.path);
	}

	//Save the fasta type
	var ftype = 'fastq';

	//Check for fasta file type
	if(Config.formats.fasta.indexOf(ext) > -1){ ftype = 'fasta'; }

  //Return the results
	return { error: false, path: file_path, type: ftype };
}

//Exports to node
module.exports = ProjectExtract;

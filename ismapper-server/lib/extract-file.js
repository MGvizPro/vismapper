//Import dependencies
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');

//Import config
var Config = require('../../ismapper-config.json');

//Application variables
var AppVars = require('../app.json');

//Function for extract the file
function ExtractFile(file, callback)
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
		var formats = AppVars.fasta.concat(AppVars.fastq);

		//For check if zip is ok
		var extracted = false;

		//Read the content
		for(var i = 0; i < zipcont.length; i++)
		{
			//Check if extension is any fasta format
			if(formats.indexOf(path.extname(zipcont[i].name)) > -1)
			{
				//Extract the file
				zip.extractEntryTo(zipcont[i], Config.uploads, false, true);

				//Save the file path
				file_path = Config.uploads + zipcont[i].name;

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
			//Set the callback with an error
			callback(true, null, null);
		}

    //Delete the zip file
		fs.unlinkSync(file.path);
	}

  //Get the type
  var isFQ = AppVars.fastq.indexOf(ext);
  var isFA = AppVars.fasta.indexOf(ext);

	//Check if the file extension is fasta or fasq
	if( isFQ > -1 || isFA > -1)
  {
    //Generate the callback args
    var args = (isFQ > -1) ? true : false;

    //Do the callback
    callback(false, file_path, args);
  }
}

//Exports to node
module.exports = ExtractFile;

//Import dependencies
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');

//Import configs
var ISConfig = require('../../ismapper-config.json');
var Config = require('../config.json');

//Extract a zip file
module.exports.extract = function(file, cb)
{
  //Check if file is a ZIP
  if(path.extname(file.originalname) !== '.zip')
  {
    //do the callback with this file path
    return cb(null, file.path);
  }

  //Get the file path
  var file_path = file.path;

  //Read the zip
  var zip = new AdmZip(file.path);

  //Get all the content
  var zipcont = zip.getEntries();

  //Generate the array with the fasta formats
  var formats = Config.formats.fasta.concat(Config.formats.fastq);

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
      file_path = path.join(ISConfig.uploads, zipcont[i].name);

      //Set extracted as true
      extracted = true;

      //Break
      break;
    }
  }

  //Delete the zip file
  return fs.unlink(file.path, function(error)
  {
    //Check if zip file has been extracted
    if(extracted === false)
    {
      //Generate the new error object
      error = new Error('No FASTA/FASTQ file found in the ZIP file');
    }

    //Do the callback
    return cb(error, file_path);
  });
};
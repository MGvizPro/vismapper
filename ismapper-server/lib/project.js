//Import dependencies
var fs = require('fs');
var db = require('dosql');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var get_id = require('getid');
var rmr = require('rmr');

//Import configs
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Import libs
var parse_fasta = require('./parse-fasta.js');
var zip = require('./zip.js');
var days = require('./utils/days.js');

//Project object
var project = {};

//Generate the project folder
project.folder = function(id)
{
  //Return the project folder
  return path.join(ISConfig.uploads, id + '/');
};

//Create a new project
project.create = function(file, opt, cb)
{
  //Generate the new project id
  var id = get_id({ prefix: 'ISM' });

  //Extract the zip file
  return zip.extract(file, function(error, extracted_path)
  {
    //Check the error
    if(error){ return cb(error, null); }

    //Project path
    var project_path = project.folder(id);

    //Create the new project folder
    return mkdirp.sync(project_path, '0777', function(error)
    {
      //check the error
      if(error){ return cb(error, null); }

      //Fastq file path
      var project_fastq = path.join(project_path, 'input.fastq');

      //Parse the fasta file
      return parse_fasta(extracted_path, project_fastq, function(error, num_reads)
      {
        //Check the error
        if(error)
        {
          //Delete the project
          return project.remove(id, function()
          {
            //Do the callback with the original error
            return cb(error, null);
          });
        }

        //Get the expiration time
        var project_expire = days.Expiration(Config.time.expiration);

        //Add the new options
        opt = Object.assign(opt, { id: id, ready: 0, date: project_expire, seq_orig: num_reads, seq_mapp: 0, time: 0 });

        //Create the project on the database
        return db.Do({in: 'project', do: 'insert', values: opt}, function(results)
        {
          //Run the project
          project.run(id);

          //Do the callback with the project id
          return cb(null, id);
        });
      });
    });
  });
};

//Delete a project
project.remove = function(id, cb)
{
  //Project path
  var project_path = project.folder(id);

  //Remove the project folder
  return rmr(project_path, { parent: true }, function(error)
  {
    //do the callback
    return cb(error);
  });
};

//Run the project
project.run = function(id)
{
  //Get the log file
  var log = path.join(project.folder(id), 'run.log');

  //Get the command
  var command = Config.command;

  //Replace the node bin location
  command = command.replace(/{node}/g, ISConfig.bin.node);

  //Get the script folder
  var runf = path.join(ISConfig.run.replace('ismapper-run.js', ''), 'ismapper-run.js');

  //Replace the run script location
  command = command.replace(/{run}/g, runf);

  //Replace the project ID
  command = command.replace(/{project}/g, id);

  //Replace the logs
  command = command.replace(/{log}/g, log);

  //Show in console the command
  console.log(command);

  //Execute the command
  exec(command);
};

//Exports to node
module.exports = project;

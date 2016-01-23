//Import dependencies
var db = require('dosql');

//Import libs
var Regions = require('../regions.js');

//Import Config
var ISConfig = require('../../../ismapper-config.json');
var Config = require('../../config.json');

//Main function
function GetRegions(req, res, next)
{
  //Get the project
  var project = req.params.project;

  //Get the min number of reads
  var minreads = req.params.reads;

  //Get the regions
  Regions(project, minreads, function(regions){

    //Save the output json
    req.output.json = regions;

    //Continue
    return next();

  });
}

//Exports to node
module.exports = GetRegions;

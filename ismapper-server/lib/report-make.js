//Import dependencies
var db = require('dosql');
var ObjSort = require('objectsort');

//Import libs
var Regions = require('./regions.js');

//Config
var Config = require('../config.json');

//Make the report
function MakeReport(req, res, next)
{
  //Get the project
  var project = req.params.project;

  //Get the regions
  Regions(project, 0, function(regions){

    //Output regions list
    var output = [];

    //Chromosomes list
    var chrs = [];

    //Get all the chromosomes
    for(var i = 0; i < regions.length; i++)
    {
      //Save the chromosome and the index
      chrs.push({ name: regions[i].id, index: i});
    }

    //Sort all the chromosomes
    chrs = ObjSort(chrs, 'name');

    //Concatenate all the chromosomes
    for(var i = 0; i < chrs.length; i++)
    {
      //Concatenate
      output = output.concat(regions[chrs[i].index].regions);
    }

    //Return the out
    req.output.json = output;

    //Continue
    return next();

  });
}

//Exports to node
module.exports = MakeReport;

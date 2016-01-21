//Import dependencies
var db = require('dosql');
var Genom = require('genom');

//Import Config
var ISConfig = require('../../../ismapper-config.json');
var Config = require('../../config.json');

//Function for get all the reads
function GetReads(req, res, next)
{
  //Get the project
  var project = req.params.project;

  //Get the list of regions
  var regions = req.params.region.split(',');

  //Create the output object
  var obj = [];

  //Calculate the number of regions
  var numreg = regions.length;

  //For each region, call the next function
  regions.forEach(function(item){

    //Call the GetReadsByRegion for this region
    GetReadsByRegion(project, item, function(results){

      //Save the reads for this region
      obj.push(results);

      //Delete this region for the list
      numreg = numreg - 1;

      //Check the number of regions
      if(numreg == 0)
      {
        //Save the output json
        req.output.json = obj;

        //Continue
        return next();
      }

    });
  });
}

//Get all the reads in a region
function GetReadsByRegion(project, reg, callback)
{
  //Get the region
  var reg = Genom.Split(reg);

  //Create the new object
  var obj = [];

  //Generate the where argument
  var wh = 'chr="' + reg.chr + '" AND start <= ' + reg.end + ' AND end >= ' + reg.start;

  //Get the regions in a selected chromosome
  db.Do({in: 'data_' + project, do: 'select', where: {chr: reg.chr}}, function(results){

    //Limit of reads
    var limitreads = Config.readsmax;

    //Counter for all the reads
    var i = 0;

    //Read all the reads
    //for(var i = 0; i < results.length; i++)
    while(i < results.length)
    {
      //Create the new counter
      var counter = 0;

      //Save the position
      var position = results[i].start;

      //Check the next reads
      for(var j = i; j < results.length; j++)
      {
        //Save the read
        var read = results[j];

        //Check positions
        if(position + Config.readsmargin > read.start)
        {
          //Increment the counter
          counter = counter + 1;

          //Get the read length
          //var l = read.seq.length;

          //Filter by start and end
          //if(reg.start <= read.end && read.start <= reg.end && counter < limitreads)
          if(counter < limitreads)
          {
            //Add the read
            obj.push(read);
          }

          //Save the next position
          position = read.start;
        }
        else
        {
          //Exit
          break;
        }
      }

      //Increment the i
      i = i + counter;
    }

    //Run the callback function
    callback(obj);
  });
}

//Exports to node
module.exports = GetReads;

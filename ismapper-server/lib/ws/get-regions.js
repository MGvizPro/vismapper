//Import dependencies
var db = require('dosql');

//Import Config
var Config = require('../../../ismapper-config.json');

//Application variables
var AppVars = require('../app.json');

//Function for create a new chr
function CreateChr(chr) { return {"id": chr, "regions": []}; }

//Main function
function GetRegions(req, res, next)
{
  //Get the project
  var project = req.params.project;

  //Get the min number of reads
  var minreads = req.params.reads;

  //Create the new object
  var obj = [];

  //Get all the regions
  db.Do({in: 'data_' + project, do: 'select'}, function(results){

    //Initialize Index
    var index = 0;

    //Insert the new
    obj.push(CreateChr(results[0].chr));

    //Start the counter
    var i = 0;

    //Read all the reads
    while(i < results.length)
    {
      //Check if chr is the same
      if(results[i].chr !== obj[index].id)
      {
        //Create the new chromosome
        obj.push(CreateChr(results[i].chr));

        //Increment the index
        index = index + 1;
      }

      //Save the position
      var position = results[i].start;

      //Create the new counter
      var counter = 1;

      //Check the next reads
      for(var j = i + 1; j < results.length; j++)
      {
        //Check positions
        if(position + AppVars.readsmargin > results[j].start)
        {
          //Increment the counter
          counter = counter + 1;

          //Save the next position
          position = results[j].start;
        }
        else
        {
          //Exit
          break;
        }
      }

      //Create the new region
      var reg = {"start": results[i].start, "end": results[i].start, "label": "" + counter + ""};

      //Check the counter
      if(counter >= minreads)
      {
        //Insert the new region
        obj[index].regions.push(reg);
      }

      //Increment the i
      i = i + counter;
    }

    //Save the output json
    req.output.json = obj;

    //Continue
    return next();

  });
}

//Exports to node
module.exports = GetRegions;

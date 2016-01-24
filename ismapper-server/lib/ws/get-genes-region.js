//Import dependencies
var db = require('dosql');
var genCoord = require('gen-coord');

//Import Config
var ISConfig = require('../../../ismapper-config.json');

//Function for get the list with the cancer genes by region
function GetGenesByRegion(req, res, next)
{
  //Get the list of regions
  var regions = req.params.region.split(',');

  //Create the output object
  var obj = [];

  //Calculate the number of regions
  var numreg = regions.length;

  //For each region, call the next function
  regions.forEach(function(item){

    //Call the FindGenesForRegion for this region
    FindGenesForRegion(item, function(results){

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

//Find in the database the oncogenes for this region
function FindGenesForRegion(reg, callback)
{
  //Get the region
  var reg = genCoord.Split(reg);

  //Create the new object
  var obj = [];

  //Get the regions in a selected chromosome
  db.Do({in: 'cancerGenes', do: 'select', where: {chr: reg.chr}}, function(results){

    //Read all the genes
    for(var i = 0; i < results.length; i++)
    {
      //Get the result
      var gene = results[i];

      //Filter by start and end
      if(reg.start <= gene.end && gene.start <= reg.end)
      {
        //Add the read
        obj.push(gene);
      }
    }

    //Run the callback function
    callback(obj);
  });
}


//Exports to node
module.exports = GetGenesByRegion;

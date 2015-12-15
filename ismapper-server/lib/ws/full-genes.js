//Import dependencies
var db = require('dosql');

//Import Config
var Config = require('../../../ismapper-config.json');

//Function for get the full list of cancer genes
function FullGenes(req, res, next)
{
  //Get all the cancer genes
  db.Do({in: 'cancerGenes', do: 'select', where: null}, function(results){

    //Save the output json
    req.output.json = results;

    //Continue
    return next();

  });
}


//Exports to node
module.exports = FullGenes;

//Import dependencies
var db = require('dosql');

//Import Config
var Config = require('../../../ismapper-config.json');

//Find a cancer gene by name
function GetGenesByName(req, res, next)
{
  //Get the name
  var name = req.params.name.toUpperCase();

  //Search
  var like = 'gene LIKE \'%' + name + '%\'';

  //Find in database
  db.Do({in: 'cancerGenes', do: 'select', where: like}, function(results){

    //Save the output json
    req.output.json = results;

    //Continue
    return next();

  });
}

//Exports to node
module.exports = GetGenesByName;

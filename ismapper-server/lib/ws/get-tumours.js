//Import dependencies
var db = require('dosql');

//Import Config
var Config = require('../../../ismapper-config.json');

//Find tumours by name
function GetTumours(req, res, next)
{
  //Get the name
  var name = req.params.name.toUpperCase();

  //Create the where with the like
  var like = 'abbreviation LIKE \'%' + name + '%\' OR term LIKE \'%' + name + '%\'';

  //Find in database
  db.Do({in: 'cancerTumours', do: 'select', where: like}, function(results){

    //Show the result
    req.output.json = results;

    //Continue
    return next();

  });
}

//Exports to node
module.exports = GetTumours;

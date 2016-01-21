//Import dependencies
var db = require('dosql');

//Import Config
var ISConfig = require('../../../ismapper-config.json');

//Full Tumours list
function FullTumours(req, res, next)
{
  //Find in database
  db.Do({in: 'cancerTumours', do: 'select', where: null}, function(results){

    //Save the output json
    req.output.json = results;

    //Continue
    return next();

  });
}

//Exports to node
module.exports = FullTumours;

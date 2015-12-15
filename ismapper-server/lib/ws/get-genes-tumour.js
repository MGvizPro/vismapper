//Import dependencies
var db = require('dosql');

//Import Config
var Config = require('../../../ismapper-config.json');

//Find cancer genes by tumour
function GetGenesByTumour(req, res, next)
{
  //Get the name
  var name = req.params.name.toUpperCase();

  //Find in database
  db.Do({in: 'cancerTumours', do: 'select', where: { 'term': name }}, function(results){

    //Check the results
    if(results.length < 1)
    {
      //Show null
      req.output.json = results;

      //Continue
      return next();
    }

    //Output
    var out = [];

    //Get the genes
    var genes = results[0].genes.split(';');

    //Get the genes number
    var genesnum = genes.length;

    //For each gene, do the query
    genes.forEach(function(item){

      //Get the gene info
      db.Do({in: 'cancerGenes', do: 'select', where: {gene: item}}, function(data){

        //Push to the output
        out.push(data[0]);

        //Delete this gene from the list
        genesnum = genesnum - 1;

        //Check
        if(genesnum == 0)
        {
          //Save the genes to the output
          results[0].genes = out;

          //Save the output json
          req.output.json = results;

          //Continue
          return next();
        }

      });
    });

  });
}

//Exports to node
module.exports = GetGenesByTumour;

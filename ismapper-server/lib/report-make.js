//Import dependencies
var db = require('dosql');
var ObjSort = require('objectsort');

//Config
var Config = require('../config.json');

//Get all the regions
function GetRegions(project, callback)
{
  //Create the new object
  var obj = [];

  //Get all the regions
  db.Do({in: project, do: 'select'}, function(results){

    //Start the counter
    var i = 0;

    //Read all the reads
    while(i < results.length)
    {
      //Save the position
      var position = results[i].start;

      //Create the new counter
      var counter = 1;

      //Create the new mapq
      var mapq = results[i].mapq;

      //Check the next reads
      for(var j = i + 1; j < results.length; j++)
      {
        //Check positions
        if(position + Config.readsmargin > results[j].start)
        {
          //Increment the counter
          counter = counter + 1;

          //Increment the mapq
          mapq = mapq + results[j].mapq;

          //Save the next position
          position = results[j].start;
        }
        else
        {
          //Exit
          break;
        }
      }

      //Generate the median mapq
      mapq = Math.floor(mapq/counter);

      //Insert the new region
      obj.push({"chr": results[i].chr, "pos": results[i].start, "num": counter, "mapq": mapq});

      //Increment the i
      i = i + counter;
    }

    //Return the reads
    callback(obj);
  });
}

//Function for get all the cancer genes
function GetCancerGenes(callback)
{
  //Get the full cancer genes list
  db.Do({in: 'cancerGenes', do: 'select', where: null}, function(results){

    //Generate the new output
    var obj = {};

    //Sort all the genes by chromosome
    results = ObjSort(results, 'chr');

    //Read all the oncogenes
    for(var i = 0; i < results.length; i++)
    {
      //Save the gene
      var g = results[i];

      //Check if chr exists
      if(typeof obj[g.chr] === 'undefined')
      {
        //Insert the chromosome
        obj[g.chr] = [];
      }

      //Add the gene
      obj[g.chr].push({'name':g.gene, 'start': g.start, 'end': g.end, 'entrez': g.entrez});
    }

    //Sort all genes by start
    for(var key in obj)
    {
      //Sort this chromosome
      obj[key] = ObjSort(obj[key], 'start');
    }

    //Return the new object
    callback(obj);
  });
}

//Make the report
function MakeReport(req, res, next)
{
  //Initialize
  req.output = {"json": null};

  //Get the project
  var project = req.params.project;

  //Get the regions
  GetRegions(project, function(reads){

    //Get the cancer genes
    GetCancerGenes(function(oncogenes){

      //Get all the chromosomes
      for(var i = 0; i < reads.length; i++)
      {
        //Get the genes for the read chromosome
        var g = oncogenes[reads[i].chr];

        //Find the min distance
        var mind = Math.min(Math.abs(reads[i].pos - g[0].start), Math.abs(reads[i].pos - g[0].end));

        //Set the default position
        var posg = 'left';

        //Save the index
        var index = 0;

        //Read all genes
        for(var j = 0; j < g.length; j++)
        {
          //Check if read is into gene
          if(g[j].start <= reads[i].pos && reads[i].pos <= g[j].end)
          {
            //Set distance as 0
            mind = 0;

            //Save the index
            index = j;

            //Exit
            break;
          }

          //Calculate the new distance
          var d = Math.min(Math.abs(reads[i].pos - g[j].start), Math.abs(reads[i].pos - g[j].end));

          //Check
          if(d < mind)
          {
            //Change the min distance
            mind = d;

            //Save the index
            index = j;
          }
        }

        //Check the position
        if(mind == 0)
        {
          //Set as inside
          posg = '--';
        }
        else if(reads[i].pos - g[index].start < 0)
        {
          //Set as right
          posg = 'right';
        }

        //Add the gene
        reads[i].genename = g[index].name;

        //Add the min distance
        reads[i].genedistance = mind;

        //Add the gene position
        reads[i].geneposition = posg;

        //Add the entrez
        reads[i].entrez = g[index].entrez;

        //Add the entrez url
        reads[i].entrezurl = Config.entrez + g[index].entrez;
      }

      //Return the out
      req.output.json = reads;

      //Continue
      return next();
    });
  });
}

//Exports to node
module.exports = MakeReport;

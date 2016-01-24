//Import dependencies
var db = require('dosql');
var ObjSort = require('objectsort');

//Config
var ISConfig = require('../../ismapper-config.json');
var Config = require('../config.json');

//Function for create a new chr
function CreateChr(chr) { return {"id": chr, "regions": []}; }

//Get all the regions
function GetRegions(project, minreads, callback)
{
	//Create the new object
	var obj = [];

	//Get all the regions
	db.Do({in: project, do: 'select'}, function(results){

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

			//Create the strand array
			var strand = { pos: 0, neg: 0};

			//Initialize the strand array
			if(results[i].strand === '+'){ strand.pos = 1; } else { strand.neg = 1; }

			//Create the new mapq
      var mapq = results[i].mapq;

			//Create the new counter
			var counter = 1;

			//Check the next reads
			for(var j = i + 1; j < results.length; j++)
			{
				//Check positions
				if(position + Config.readsmargin > results[j].start)
				{
					//Increment the counter
					counter = counter + 1;

					//Save the next position
					position = results[j].start;

					//Increment the strand
					if(results[j].strand === '+'){ strand.pos++; } else { strand.neg++; }

					//Increment the mapq
          mapq = mapq + results[j].mapq;
				}
				else
				{
					//Exit
					break;
				}
			}

			//Check the reads counter
			if(counter >= minreads)
			{
				//Create the new region
				var reg = {};

				//Save the chromosome
				reg.chr = results[i].chr;

				//Save the start and end positions
				reg.start = results[i].start;
				reg.end = results[i].start;

				//Save the count of reads
				reg.label = counter.toString();
				reg.count = counter;

				//Add the strand
				if(strand.pos >= strand.neg)
				{
					//Save the positive strand
					reg.strand = '+';
				}
				else
				{
					//Save the negative strand
					reg.strand = '-';
				}

				//Generate and save the median mapq
	      reg.mapq = Math.floor(mapq/counter);

				//Insert the new region
				obj[index].regions.push(reg);
			}

			//Increment the i
			i = i + counter;
		}

		//Continue
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
    //results = ObjSort(results, 'chr');

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
      //obj[key] = ObjSort(obj[key], 'start');
    }

    //Return the new object
    callback(obj);
  });
}

//Get the regions
function Regions(id, minreads, callback)
{
  //Get the regions
  GetRegions(id, minreads, function(regions){

    //Get the cancer genes
    GetCancerGenes(function(cgenes){

      //Get all the chromosomes
      for(var k = 0; k < regions.length; k++)
      {
				//Get the genes for the region chromosome
        var g = cgenes[regions[k].id];

				//Read all the regions in the chromosome
				for(var i = 0; i < regions[k].regions.length; i++)
				{
					//Initialize the left and right distance
					var leftd = { distance: 999999999999, index: -1};
					var rightd = { distance: 999999999999, index: -1};

	        //Read all genes
	        for(var j = 0; j < g.length; j++)
	        {
	          //Check if read is into gene
	          if(g[j].start <= regions[k].regions[i].start && regions[k].regions[i].start <= g[j].end)
	          {
	            //Set distance as 0
	            leftd.distance = 0; rightd.distance = 0;

	            //Save the index
	            leftd.index = j; rightd.index = j;

	            //Exit
	            break;
	          }

						//Check if gene is at left of the position
						if(g[j].end < regions[k].regions[i].start)
						{
							//Save the distance
							var d = regions[k].regions[i].start - g[j].end;

							//Check for save
							if(d < leftd.distance)
							{
								//Save the distance
								leftd.distance = d;

								//Save the index
								leftd.index = j;
							}
						}
						else if(regions[k].regions[i].start < g[j].start)
						{
							//Save the distance
							var d = g[j].start - regions[k].regions[i].start;

							//Check for save the distance
							if(d < rightd.distance)
							{
								//Save the distance
								rightd.distance = d;

								//Save the index
								rightd.index = j;
							}
						}
	        }

					//Save the left gene
					regions[k].regions[i].leftg = (leftd.index > -1)? g[leftd.index].name : '--';

					//Save the left gene distance
					regions[k].regions[i].leftd = (leftd.index > -1)? leftd.distance : 0;

					//Save the left gene entrez
					regions[k].regions[i].lefte = (leftd.index > -1)? g[leftd.index].entrez : '--';

					//Save the right gene
					regions[k].regions[i].rightg = (rightd.index > -1)? g[rightd.index].name : '--';

					//Save the right gene distance
					regions[k].regions[i].rightd = (rightd.index > -1)? rightd.distance : 0;

					//Save the right gene entrez
					regions[k].regions[i].righte = (rightd.index > -1)? g[rightd.index].entrez : '--';
				}

				//Next chromosome
      }

      //Do the callback
			callback(regions);

    });
  });
}

//Exports to node
module.exports = Regions;

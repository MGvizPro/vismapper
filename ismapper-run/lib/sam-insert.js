//Import dependencies
var db = require('dosql');
var objectSort = require('objectsort');

//Import the table
var dataTable = require('../data.json');

//Function for insert the data into the database
function SamInsert(id, data, chrs, callback)
{
	//Insert the new table
	db.Do({ do: 'create table', named: id, definedby: dataTable }, function(results){

		//Read and insert all the chromosomes
		SamInsertChr(id, data, chrs, 0, function(){ callback(); });

	});
}

//Function for insert a chromosome into database
function SamInsertChr(id, data, chrs, n, callback)
{
	//Get the chromosome
	var ch = chrs[n];

	//Sort the chromosome by start position
	data[ch] = objectSort(data[ch], 'start');

	//Insert the full chromosome into the database
	db.Do({ in: id, do: 'insert', values: data[ch] }, function(res){

		//Increment the counter
		n = n + 1;

		//Check the n
		if(n < chrs.length)
		{
			//Insert the next chromosome
			SamInsertChr(id, data, chrs, n, callback);
		}
		else
		{
			//Do the callback
			callback();
		}

	});
}

//Exports the module
module.exports = SamInsert;

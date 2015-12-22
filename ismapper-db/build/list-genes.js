//Usage:
//node list-genes.js > query.sql

//Function for find the location
function FindLocation(loc)
{
	//Split by :
  var chr = loc.split(':');

	//Split by -
	var region = chr[1].split('-');

	//Return the array
	return [chr[0], region[0], region[1]];
}

//Import configuration
var Config = require('../../ismapper-config.json');

//Import the values
var file = require('./full-genes.json');

//Rows
var rows = ['gene','name','entrez','location','chrband','somatic',
						'germline','tumour_types_somatic','tumour_types_germline',
						'cancer_syndrome','tissue','molecular','mutation','translocation',
						'other_mut','other_syndrome','synonyms'];

//Initialize the insert
var insert = '';

//Initialize the query
console.log('USE ' + Config.db.db + ';');
console.log('');
console.log('CREATE TABLE cancerGenes');
console.log('(');

//Create the rows
console.log('	id int(99) NOT NULL,');
console.log('	gene varchar(255) NOT NULL,');
console.log('	name text NOT NULL,');
console.log('	chr varchar(255) NOT NULL,');
console.log('	start int(99) NOT NULL,');
console.log('	end int(99) NOT NULL,');
console.log('	band varchar(255) NOT NULL,');
console.log('	entrez varchar(255) NOT NULL,');
console.log('	molgenetics varchar(255) NOT NULL,');
console.log('	synonyms text NOT NULL,');
console.log('	tt_somatic text NOT NULL,');
console.log('	tt_germline text NOT NULL,');

//End the create table query
console.log('	PRIMARY KEY(id)');
console.log(');');
console.log('');

//Show the first line of the query
console.log('INSERT INTO cancerGenes (id,gene,name,chr,start,end,band,entrez,molgenetics,synonyms,tt_somatic,tt_germline) VALUES ');

//Create the values
for(var i = 0; i < file.length; i++)
{
	//String for the value
	var value = '(';

	//Save the gene
	var item = file[i];

	//Get the coordinate
	var location = FindLocation(item['location']);

	//Add the id
	value = value + i + ', ';

	//Add the gene
	value = value + '"' + item['gene'] + '", ';

	//Add the name
	value = value + '"' + item['name'] + '", ';

	//Add the chromosome
	value = value + '"' + location[0] + '", ';

	//Add the start position
	value = value + location[1] + ', ';

	//Add the end position
	value = value + location[2] + ', ';

	//Add the chrband
	value = value + '"' + item['chrband'] + '", ';

	//Add the entrez id
	value = value + '"' + item['entrez'] + '", ';

	//Add the molecular genetics
	value = value + '"' + item['molecular'] + '", ';

  //Add the synonyms
  value = value + '"' + item['synonyms'] + '", ';

  //Add the tumour type somatic
  value = value + '"' + item['tumour_types_somatic'] + '", ';

  //Add the tumour type germline
  value = value + '"' + item['tumour_types_germline'] + '"';

	//Finish the value
	value = value + ')';

	//Check the position
	if(i < file.length - 1)
	{
		//Add a comma
		value = value + ',';
	}
	else
	{
		//Add a ;
		value = value + ';';
	}

	//Show
	console.log(value);
}

//Done

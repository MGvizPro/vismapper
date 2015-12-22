//Usage:
//node list-tumours.js

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

//Function for find disease
function FindDisease(disease)
{
  //Read all abbreviations
  for(var i = 0; i < abbr.length; i++)
  {
    //Check
    if(disease === abbr[i].abbreviation)
    {
      //Return
      return abbr[i].term;
    }
  }

  //Return null
  return '';
}

function CapitalizeStr(string)
{
  //Capitalize
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Import configuration
var Config = require('../../ismapper-config.json');

//Import the values
var file = require('./full-genes.json');
var abbr = require('./abbreviations.json');

//Array with diseases
var dis = [];
var gen = [];
var typ = [];
var rty = [];

//Create the values
for(var i = 0; i < file.length; i++)
{
  //Check for somatic
	CheckDiseaseList('somatic');

  CheckDiseaseList('germline');
}

//Function for check the diseases
function CheckDiseaseList(type)
{
  //Get the diseases
  var d = file[i]['tumour_types_' + type].split(';');

  //Check all diseases
  for(var j = 0; j < d.length; j++)
  {
    //Check the index
    var pos = dis.indexOf(d[j]);

    //Check if disease exists
    if(pos == -1)
    {
      //Add the new disease
      dis.push(d[j]);

      //Add the new genes array
      gen.push([]);

      //Add the type
      typ.push(type);

      //Add the real type
      rty.push(CapitalizeStr(type));

      //Change the pos
      pos = dis.length - 1;
    }

    //Check the type
    if(typ[pos] !== type)
    {
      //Save the real
      rty[pos] = 'Somatic, Germline';
    }

    //Add the gene to the array
    gen[pos].push(file[i]['gene']);
  }
}

//Initialize the query
console.log('USE ' + Config.db.db + ';');
console.log('');
console.log('CREATE TABLE cancerTumours');
console.log('(');

//Create the rows
console.log('	id int(99) NOT NULL,');
console.log('	abbreviation text NOT NULL,');
console.log('	term text NOT NULL,');
console.log('	mutation text NOT NULL,');
console.log('	genes text NOT NULL,');

//End the create table query
console.log('	PRIMARY KEY(id)');
console.log(');');
console.log('');

//Show the first line of the query
console.log('INSERT INTO cancerTumours (id,abbreviation,term,mutation,genes) VALUES ');

//Show list
for(var i = 0; i < dis.length; i++)
{
  //String for the value
	var value = '(';

  //Show the index
  value = value + i + ', ';

  //Check for abbreviation
  var a = FindDisease(dis[i]);

  if(a === '')
  {
    //Show as term
    value = value + '"", "' + dis[i] + '", ';
  }
  else
  {
    //Show as abbreviation - term
    value = value + '"' + dis[i] + '", ';
    value = value + '"' + a + '", ';
  }

  //Add the moutation
  value = value + '"' + rty[i] + '", ';

  //Var for the genes list
  var genes = '';

  //Show the genes
  for(var j = 0; j < gen[i].length; j++)
  {
    //Check for add a ;
    if(j > 0) { genes = genes + ';'; }

    //Add the gene
    genes = genes + gen[i][j];
  }

  //Add to the value
  value = value + '"' + genes + '")';

  //Check the position
	if(i < dis.length - 1)
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

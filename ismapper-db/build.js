/***************************************************

ISMapper Build

Build the shell script and the database for ISMapper.
Usage: node build.js

*/

//Import dependencies
var fs = require('fs');

//Import config
var Config = require('../ismapper-config.json');

//Databases source
var sourceDB = [];
sourceDB.push(require('./source/project.json')); //Projects table
sourceDB.push(require('./source/demo.json')); //Demo project table
sourceDB.push(require('./source/cancerGenes.json')); //Cancer Genes table
sourceDB.push(require('./source/cancerTumours.json')); //Cancer Tumours table

//Line end
var endl = '\n';

//Function for get the insert values
function GetInsertVals(row)
{
  //Output array
  var out = [];

  //Get all the cols
  for(var key in row){ out.push(key); }

  //Return all the cols
  return out;
}

//Function for build the database
function BuildDB(f)
{
  //Initialize the out
  var c = 'USE ' + Config.db.db + ';' + endl + endl;

  //Read all the tables
  for(var i = 0; i < sourceDB.length; i++)
  {
    //Save the table
    var t = sourceDB[i];

    //Check the content
    if(typeof t.content === 'undefined'){ t.content = []; }

    //Initialize the structure
    c = c + 'CREATE TABLE ' + t.name + endl;
    c = c + '(' + endl;

    //Add the columns
    for(var key in t.structure.cols)
    {
      //Add the col
      c = c + '  ' + key + ' ' + t.structure.cols[key] + ',' + endl;
    }

    //Add the primary key
    c = c + '  PRIMARY KEY (' + t.structure.primary + ')' + endl;

    //Finish the structure
    c = c + ');' + endl;

    //Only if we have any content
    if(t.content.length > 0)
    {
      //Get the insert values
      var ins = GetInsertVals(t.content[0]);

      //Save the insert query
      c = c + endl + 'INSERT INTO ' + t.name + ' (' + ins.join(',') + ') VALUES ' + endl;

      //Insert all
      for(var j = 0; j < t.content.length; j++)
      {
        //Check for add a comma
        if(j > 0){ c = c + ',' + endl; }

        //Initialize
        c = c + '(';

        //Save all the values
        for(var k = 0; k < ins.length; k++)
        {
          //Check for add a comma
          if(k > 0){ c = c + ','; }

          //Value for insert
          var value = t.content[j][ins[k]];

          //Check is the value is a string
          if(typeof t.content[j][ins[k]] === 'string')
          {
            //Insert the "
            value = '"' + value + '"';
          }

          //Insert the value
          c = c + value;
        }

        //End the insert
        c = c + ')';
      }

      //End the insert
      c = c + ';' + endl;
    }

    //Add a new line
    c = c + endl;
  }

  //Save to file
  fs.writeFileSync(f, c, 'utf8');
}


//Show in console the build progress
console.log('');
console.log('ISMapper DB Builder v1.0.0');
console.log('');

//Show next step: build .sql
console.log('Creating .sql file...');

//Build the sql file
BuildDB('./ismapper.sql');

//Show in console
console.log('SQL file created!');
console.log('Now you can insert the SQL file into your databse using: ');
console.log('$ mysql --host=' + Config.db.host + ' --user=' + Config.db.user + ' -p < ismapper.sql');

//Show done
console.log('');
console.log('Build done!');

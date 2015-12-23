/***************************************************

ISMapper Build

Build the shell script and the database for ISMapper.
Usage: node build.js

*/

//Import dependencies
var fs = require('fs');

//Import config
var Config = require('./ismapper-config.json');

//Databases source
var sourceDB = [];
sourceDB.push(require('./ismapper-db/source/project.json')); //Projects table
sourceDB.push(require('./ismapper-db/source/demo.json')); //Demo project table
sourceDB.push(require('./ismapper-db/source/cancerGenes.json')); //Cancer Genes table
sourceDB.push(require('./ismapper-db/source/cancerTumours.json')); //Cancer Tumours table

//Line end
var endl = '\n';

//Function for build the sh file
function BuildSH(f)
{
  //Initialize the file
  var c = '';

  // Add the interpreter
  c = c + '#!/bin/bash' + endl;
  c = c + endl;

  // Save the project ID
  c = c + 'PROJECT=$1' + endl;

  // Save if the file is a fastq
  c = c + 'ISFASTQ=$2' + endl;

  //Save the user email
  //c = c + 'EMAIL=$3' + endl;

  //Space
  c = c + endl;

  // Define the folders
  c = c + 'FOLDER_FILES=\'' + Config.server.uploads + '\'$PROJECT' + endl;
  c = c + 'FOLDER_SAMTOOLS=\'' + Config.bin.samtools + '\'' + endl;
  c = c + 'FOLDER_BWA=\'' + Config.bin.bwa + '\'' + endl;
  c = c + 'FOLDER_BIN=\'' + Config.bin.path + '\'' + endl;

  // Reference genome location
  c = c + 'REFGEN=\'' + Config.reference + '\'' + endl;

  // Define the string for check if is a fastq
  c = c + 'NEEDFASTQ="YES"' + endl;

  //Define the string for send the email
  c = c + 'NEEDEMAIL="null"' + endl;

  //Space
  c = c + endl;

  //Sleep
  c = c + '#sleep 5' + endl;
  c = c + endl;

  // Check if file is fastq
  c = c + 'if [ $ISFASTQ != $NEEDFASTQ ]' + endl;
  c = c + 'then' + endl;
  c = c + '\t$FOLDER_BIN/fasta2q $FOLDER_FILES' + endl;
  c = c + 'fi' + endl;
  c = c + endl;

  // Map to the reference genome
  c = c + '$FOLDER_BWA mem -t 2 $REFGEN $FOLDER_FILES/input.fastq > $FOLDER_FILES/input.sam' + endl;
  c = c + endl;

  // Generate the BAM file (need for sort)
  c = c + '$FOLDER_SAMTOOLS view -b -o $FOLDER_FILES/input.bam $FOLDER_FILES/input.sam' + endl;
  c = c + endl;

  // Sort the BAM file and save as SAM file
  c = c + '$FOLDER_SAMTOOLS sort -O sam -T _sorting -o $FOLDER_FILES/input.sam $FOLDER_FILES/input.bam' + endl;
  c = c + endl;

  // Generates SQL query using the SAM file
  c = c + '$FOLDER_BIN/sam2sql $PROJECT $FOLDER_FILES' + endl;
  c = c + endl;

  // Inserts SQL file into database
  c = c + 'mysql --host=' + Config.db.host + ' --user=' + Config.db.user + ' --password=' + Config.db.pass + ' < $FOLDER_FILES/query.sql' + endl;
  c = c + endl;

  //Send confirmation email
  //Coming soon

  // Delete files
  //c = c + 'rm -rf $FOLDER_FILES' + endl;
  //c = c + endl;

  //Save the new sh file
  fs.writeFileSync(f, c, 'utf8');
}

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
console.log('ISMapper Builder v1.0.0');
console.log('');

//Show step: build .sh
console.log('Creating .sh file on ./ismapper-bin');

//Build the sh file
BuildSH('./ismapper-bin/run.sh');

//Show in console
console.log('Shell file created!');
console.log('');

//Show next step: build .sql
console.log('Creating .sql file on ./ismapper-db');

//Build the sql file
BuildDB('./ismapper-db/ismapper.sql');

//Show in console
console.log('SQL file created!');
console.log('Now you can insert the SQL file into your databse using: ');
console.log('$ mysql --host=' + Config.db.host + ' --user=' + Config.db.user + ' -p < ismapper.sql');

//Show done
console.log('');
console.log('Build done!');

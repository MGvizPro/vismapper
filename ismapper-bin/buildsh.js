//Import dependencies
var fs = require('fs');

//Import the config file
var Config = require('../ismapper-config.json');

//Sh name
var sh = 'run.sh';

//Line end
var endl = '\n';

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
c = c + 'EMAIL=$3' + endl;

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
c = c + 'mysql --user=' + Config.db.user + ' --password=' + Config.db.pass + ' < $FOLDER_FILES/query.sql' + endl;
c = c + endl;

// Delete files

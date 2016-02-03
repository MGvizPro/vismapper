//Import dependencies
var execSync = require('child_process').execSync;

//Import configs
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Convert sam to bam
function SamConvert(file)
{
	//Get the new file
	var bam = file.replace('.sam', '.bam');

	//Create the command
	var command = Config.samtools;

	//Replace the samtools bin
	command = command.replace(/{path}/g, ISConfig.bin.samtools);

	//Replace the bam file
	command = command.replace(/{bam}/g, bam);

	//Replace the sam file
	command = command.replace(/{sam}/g, file);

	//Show in console
	console.log('Convert SAM to BAM file');
	console.log(command);

	//Execute
	execSync(command);
}

//Exports to node
module.exports = SamConvert;

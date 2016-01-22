//Import dependencies
var fastaTools = require('fasta-tools');

//Function for check the fasta file
function ProjectFasta(file, format)
{
	//Read the fasta file
	var f = fastaTools.ReadSync(file, format);

	//Check if the file is correct
	if(f.num == 0)
	{
		//File is not correct, return false
		return { error: true, num: 0 };
	}

	//Check the format
	if(format === 'fasta')
	{
		//Save as fastq
		f.format = 'fastq';

		//Save the file
		fastaTools.SaveSync(file, f);
	}

	//Exit
	return { error: false, num: f.num };
}

//Exports to node
module.exports = ProjectFasta;

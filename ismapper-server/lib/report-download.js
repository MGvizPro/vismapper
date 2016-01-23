//Config
var Config = require('../config.json');

//Initialize the columns
var cols = ['Chr','Position','Strand','Number of reads','Mean MapQ','CLCG Name','CLCG Distance',
						'CLCG Entrez','CLCG Url','CRCG Name','CRCG Distance','CRCG Entrez','CRCG Url'];

//Tabulator
var tab = '\t';

//Linebreak
var endl = '\n';

//Download report function
function DownloadReport(req, res, next)
{
  //Set header for file
	res.setHeader('Content-disposition', 'attachment; filename=report.tsv');

	//Set header for text plain
	res.setHeader('Content-type', 'text/plain');

	//Set the charset
	res.charset = 'UTF-8';

  //Get the json
  var content = req.output.json;

  //Initialize the output
  var out = '';

  //Insert the columns
  for(var i = 0; i < cols.length; i++)
  {
    //Add the tabulator
    if(i > 0) { out = out + tab; }

    //Insert
    out = out + cols[i];
  }

  //Insert line break
  out = out + endl;

  //Read all fields
  for(var i = 0; i < content.length; i++)
  {
    //Save the chromosome
		out = out + content[i].chr + tab;

		//Save the position
		out = out + content[i].start + tab;

		//Save the strand
		out = out + content[i].strand + tab;

		//Save the number of reads
		out = out + content[i].label + tab;

		//Save the mean map quality
		out = out + content[i].mapq + tab;

		//Save the CLCG name
		out = out + content[i].leftg + tab;

		//Save the CLCG distance
		out = out + content[i].leftd + tab;

		//Save the CLCG Entrez
		out = out + content[i].lefte + tab;

		//Save the CLCG Entrez url
		out = out + Config.entrez + content[i].lefte + tab;

		//Save the CRCG Name
		out = out + content[i].rightg + tab;

		//Save the CRCG distance
		out = out + content[i].rightd + tab;

		//Save the CRCG Entrez
		out = out + content[i].righte + tab;

		//Save the CRCG Entrez URL
		out = out + Config.entrez + content[i].righte;

    //Add end line
    out = out + endl;
  }

	//Write the content
	res.write(out);

	//Finish response
	res.end();
}

//Exports to node
module.exports = DownloadReport;

//Application variables
var AppVars = require('../app.json');

//Initialize the columns
var cols = ['Chr','Position','Number of reads','Mean MapQ','Closest Cancer Gene',
						'Distance to Cancer Gene','Cancer Gene position','Cancer Gene Entrez', 'Entrez URL'];

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
    //Counter
    var count = 0;

    //Read all items
    for(var key in content[i])
    {
      //Insert the tab
      if(count > 0) { out = out + tab; }

      //Insert the content
      out = out + content[i][key];

      //Increment the counter
      count = count + 1;
    }

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

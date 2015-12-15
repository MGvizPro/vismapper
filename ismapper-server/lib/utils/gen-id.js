//Function for generate the new ID
function GenID()
{
	//Get the date
	var dat = Date.now().toString();

	//Get a random string
	var str = Math.random().toString(36).slice(2).substr(0, 4);

	//Generate the new ID
	var newid = str + dat;

	//Return
	return newid;
}

//Exports to node
module.exports = GenID;

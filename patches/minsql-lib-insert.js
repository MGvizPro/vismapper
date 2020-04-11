//This is a hardcoded patch for package minsql
//This file should be copied to ismapper-server/node_modules/minsql/lib after installing 
//node modules in ismapper-server using the following command:
//
//$ cp patches/minsql-lib-insert.js ismapper-server/node_modules/minsql/lib/insert.js
//

//Query insert
function QueryInsert(data)
{
	//Containers
	var sql_atr = '';
	var sql_val = [];
	
	//Check if data is an array
	if(Array.isArray(data) === false)
	{
		//Convert it to array
		data = [data];
	}
	
	//Ger the keys
	var keys = GetKeys(data);
	
	//Get the atr string
	sql_atr = keys.join(',');
	
	//Read all data
	for(var i = 0; i < data.length; i++)
	{
		//Get the values
		var value = GetValues(data[i], keys, i);
		
		//Add the ()
		value = '(' + value + ')';
		
		//Push
		sql_val.push(value);
	}
	
	//Paste
	var sql = '(' + sql_atr + ') VALUES ' + sql_val.join(' , ');
	
	//Return
	return sql;
}

//Get the keys
function GetKeys(data)
{
	//Output array
	var keys = [];
	
	//Read all keys
	for(var key in data[0])
	{
		//Push
		keys.push(key);
	}
	
	//Return the keys
	return keys;
}

//Get all the values
function GetValues(mydata, keys, index)
{
	//Output
	var values = [];
	
	//Loop
	for(var j = 0; j < keys.length; j++)
	{
		//Save data value
		var value = mydata[keys[j]];
		
		//Check if value exists
        //if(!value) <<<<<<< if value is 0 this is true!!!!!!
        if (typeof value === "undefined") 
		{
			//Show warning
			console.log('WARNING: value "' + keys[j] + '" is not defined on element "' + index + '" of your array.');
			
			//Set it to empty string
			value = '';
		}
		
		//Check the data type
		if(typeof value === 'string' || value instanceof String)
		{
			//Add the quotes
			value = '"' + value + '"';
		}
		
		//Push
		values.push(value);
	}
	
	//Return
	return values.join(',');
}


//Exports
module.exports = QueryInsert;

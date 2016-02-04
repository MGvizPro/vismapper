//Sort main function
function ObjectSort(array, by)
{
	//Array with the selected cols
	var newarr = [];

	//Get only
	for(var i = 0; i < array.length; i++)
	{
		//Get
		newarr.push(array[i][by]);
	}

	//Sort
	var index = ArraySort(newarr);

	//Restart the array
	newarr = [];

	//Loop for sort the original array with the new indices
	for(var i = 0; i < index.length; i++)
	{
		newarr.push(array[index[i]]);
	}

	//Return the sorted array
	return newarr;
}


//Sort an array
function ArraySort(array)
{
	//Index arrays
	var index = [];

	//Add the elements with the index
	for(var k = 0; k < array.length; k++)
	{
		array[k] = [array[k], k];
	}

	//Sort the array
	array.sort(function(left, right){ return left[0] < right[0] ? -1 : 1; });

	//Add the index
	for(var k = 0; k < array.length; k++)
	{
		index.push(array[k][1]);
	}

	//Return the indices
	return index;
};


//Check for exports
if (typeof module === "object" && module.exports)
{
	//Export module
	module.exports = ObjectSort;
}

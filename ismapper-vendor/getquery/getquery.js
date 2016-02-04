/* ************************************************************************
 *  GetQuery.js
 *  Created by Josemi Juanes [jm.juanes.xyz].
 *  Under the MIT LICENSE.
 *  
 *  For more info, visit https://github.com/jmjuanes/GetQuery.js
 *  
 */

//Main
function GetQuery()
{
	//Initialize
	var g = {};
	
	//Get the url
	var url = document.location.href;
	
	//Get the query from the question mark
	var query = url.split('?')[1];
	
	//Check for undefined
	if(typeof query !== 'undefined')
	{
		//Split by &
		var GET = query.split('&');
		
		//Loop for get all
		for(var i = 0; i < GET.length; i++)
		{
			//Split by =
			var query = GET[i].split('=');
			
			//Add to the array
			g[query[0]] = unescape(decodeURI(query[1]));
		}
	}
	
	//Return the array
	return g;
}

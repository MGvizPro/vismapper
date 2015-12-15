//Import dependencies
var db = require('dosql');

//Function for check the project
function CheckProject(req, res, next)
{
  //Get the project ID
	var id = req.params.id;

	//Get the info from the database
	db.Do({in: 'project', do: 'select', where: {'id': id}}, function(results){

		//Check for results
		if(results.length > 0)
		{
			//Save the results
      req.result = results[0];

      //Next
      return next();
		}
		else
		{
			//Redirect
			res.redirect('/');
		}
	});
}

//Exports to node
module.exports = CheckProject;

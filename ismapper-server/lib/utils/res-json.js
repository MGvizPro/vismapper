//Set JSON content
function SetJson(req, res, next)
{
  //Change the header
  res.set('Content-Type', 'application/json');

  //Initialize the json output
  req.output = {"json": []};

  //Continue
  return next();
}

//Show JSON content
function ShowJson(req, res, next)
{
  //Show the json
  res.json(req.output.json);
}

//Exports to node
module.exports = { Set: SetJson, Show: ShowJson };

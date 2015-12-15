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

//Exports to node
module.exports = SetJson;

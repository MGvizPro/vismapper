//Show JSON content
function ShowJson(req, res, next)
{
  //Show the json
  res.json(req.output.json);
}

//Exports to node
module.exports = ShowJson;

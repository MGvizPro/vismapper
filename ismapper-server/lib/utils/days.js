//Import app config
var AppVars = require('../../app.json');

//ml2seconds * seconds2min * min2hours * hours2days
var ml2days = 1000 * 60 * 60 * 24;

//Function for count the remaining days
exports.Remaining = function(ml)
{
  //Create a new data
  var d = new Date();

  //Get the remaining time in ml
  var rest = ml - d.getTime();

  //Return the time
  return Math.max(0, Math.floor(rest/ml2days));
};

//Function for get the final date
exports.Expiration = function()
{
  //Get the actual date
  var d = new Date();

  //Return the expiration day
  return d.getTime() + AppVars.time.expiration;
};

//Function for get the extended time
exports.Extend = function(d)
{
  //Extend the time one month more
  return d + AppVars.time.extend;
};

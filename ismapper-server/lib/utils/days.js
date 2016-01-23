//ml2seconds * seconds2min * min2hours * hours2days
var ml2days = 1000 * 60 * 60 * 24;

//Function for count the remaining days
exports.Remaining = function(ml)
{
  //Get the remaining time in ml
  var rest = ml - Date.now();

  //Return the time
  return Math.max(0, Math.floor(rest/ml2days) + 1);
};

//Function for get the final date
exports.Expiration = function(available)
{
  //Return the expiration day
  return Date.now() + available;
};

//Function for get the extended time
exports.Extend = function(d, extend)
{
  //Extend the time one month more
  return d + extend;
};

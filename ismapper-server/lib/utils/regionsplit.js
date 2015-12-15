//Function for split the region
function RegionSplit(reg)
{
  //Spli by :
  var spl = reg.split(':');

  //Get the chromosome
  var chr = '' + spl[0];

  //Get the start
  var start = parseInt(spl[1].split('-')[0]);

  //Get the end
  var end = parseInt(spl[1].split('-')[1]);

  //Return
  return {"chr": chr, "start": start, "end": end};
}

//Exports to node
module.exports = RegionSplit;

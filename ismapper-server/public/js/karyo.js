//Initialize the element
var k = null;

//When document is ready
$(document).ready(function(){

  //Create the new Karyo element
  k = new Karyo('karyo_div');

  //Use the Human test specie
  k.ImportChrs(Params.specie);

  //Use the human test data
  k.ImportRegions(Params.regions + Params.default.minreads);

  //Labels
  k.UseLabel({
    chromosome: function(chr){
      
      //Get the regions for this chromosome
      var regs = k.GetRegionsByChr(chr);

      //Check if exists
      if(regs) { return '' + regs.length + ' positions'; }

      //Return default
      return '0 positions';

    },
    region: function(chr, reg){

      //Get the regions for this chromosome
      var regs = k.GetRegionsByChr(chr);

      //Return the label
      return '' + regs[reg].label + ' reads';

    }
  });

  //Use Genome Maps plugin
  k.UsePlugin('genome-maps');

  //For clear the tracks
  k.CallbackGoBack(function(){

    //Clean the oncogenes track
    genomeViewer.trackListPanel.tracks[1].clean();

    //Clean the reads track
    genomeViewer.trackListPanel.tracks[2].clean();

  });

});

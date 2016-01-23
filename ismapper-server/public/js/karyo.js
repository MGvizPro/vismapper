//Initialize the element
var k = null;

//When document is ready
$(document).ready(function(){

  //Create the new Karyo element
  k = new Karyo('karyo_div');

  //Use the Human test specie
  k.ImportChrs({ fromDB: 'hsapiens/grch38' });

  //Use the human test data
  k.ImportRegions({ url: Params.regions + Params.default.minreads });

  //Labels
  k.UseLabel({
    chromosome: function(chr)
    {
      //Get the regions for this chromosome
      var regs = k.GetRegionsByChr(chr);

      //Check if exists
      if(regs) { return '' + regs.length + ' positions'; }

      //Return default
      return '0 positions';
    },
    region: function(chr, region)
    {
      //Return the label
      return '' + region.label + ' reads';
    }
  });

  //Report table
  k.TableOpt({
    colsName: ['Chr','Start','End','Strand','Reads','CLCG','CRCG'],
    colsAlign: ['center','right','right','center','center','center','center'],
    //openShow: true,
    //openText: 'Open',
    parser: function(chr, region)
    {
      //Return the default row
      return [chr,region.start,region.end,region.strand,region.label+' reads',region.leftg,region.rightg];
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

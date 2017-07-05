//Import dependencies
var fs = require('fs');
var fasta_tools = require('fasta-tools');

//Parse a fasta/fastq file
module.exports = function(input_fasta, output_fasta, cb)
{
  //Display in console
  console.log('Reading FASTA file ' + input_fasta);

	//Read the fasta or fastq file
  fasta_tools.read(input_fasta,  function(error, obj)
  {
    //Check the error
    if(error){ return cb(error, null); }

    //Display in console
    console.log('FASTA file processed. Detected ' + obj.reads.length);

    //Check the file format
    if(obj.format === 'fasta')
    {
      //Convert to fastq
      obj = fasta_tools.toFastQ(obj, 20);
    }

    //Save the number of reads
    var num_reads = obj.reads.length;

    //Display in console
    console.log('Saving FASTQ file as ' + output_fasta);

    //Save the fastq file
    return fasta_tools.write(output_fasta, obj, function(error)
    {
      //Display in console
      console.log('FASTQ file saved');
      
      //Check the error
      if(error){ return cb(error, 0); }

      //Delete the original file
      return fs.unlink(input_fasta, function(error)
      {
        //Do the callback
        return cb(error, num_reads);
      });
    });
  });
};

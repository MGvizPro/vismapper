// SAM Keys:
// 0: QNAME: read name
// 1: FLAG: bitwise flag
// 2: RNAME: chromosome
// 3: POS: leftmost genomic position
// 4: MAPQ: mapping quality
// 5: CIGAR: CIGAR string (gaps, clipping)
// 6: RNEXT: paired read name
// 7: PNEXT: paired read position
// 8: TLEN: total length of template
// 9: SEQ: read base sequence
// 10: QUAL: read base quality

//We will save:
// -> name: 0
// -> strand: 1
// -> chr: 2
// -> start: 3
// -> mapq: 4
// -> cigar: 5
// -> seq: 9

//Function for parse the sam line
function SamParse(line, quality)
{
	//Check for empty line
	if(line === '' || line === ' '){ return null; }

	//Check for header
	if(line[0] === '@'){ return null; }

	//Remove line ends
	line = line.replace(/\n/g, '').replace(/\r/g, '');

	//Split the line by tab
	line = line.split('\t');

	//Check for the quality
	if(parseInt(line[4]) < quality){ return null; }

	//Generate the new object
	var obj = {};

	//Save the name
	obj.name = line[0];

	//Save the strand
	obj.strand = (line[1] === '16')? '-' : '+';

	//Save the chromosome
	obj.chr = line[2];

	//Save the position
	obj.start = parseInt(line[3]);
	obj.end = obj.start + line[9].length;

	//Save the mapquality
	obj.mapq = parseInt(line[4]);

	//Save the CIGAR
	obj.cigar = line[5];

	//Save the sequence
	//obj.seq = line[9];
	obj.seq = 'A';

	//Return the object
	return obj;
}

//Exports to node
module.exports = SamParse;

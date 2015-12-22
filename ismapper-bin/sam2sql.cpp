// sam2sql : read a sam and generates the SQL query

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
// -> chr: 2
// -> pos: 3
// -> mapq: 4
// -> cigar: 5
// -> seq: 9

//Import dependencies
#include <iostream>
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
using namespace std;

//Files location (DEPRECATED)
//const string files_url = "/home/jmjuanes/apps/uploads/";

//Number of elements of the SAM
const int N = 11;

//Min quality for the reads
const int MinQ = 20;

//Function String to array
void StringToArray(string str, string arr[])
{
  //Aux vars
  int pos = 0;

  //Read all
  for(int i = 0; i < N; i++)
  {
    //Find the next tab
    pos = str.find("\t");

    //Get the substring
    arr[i] = str.substr(0, pos);

    //Cut the string
    str = str.substr(pos + 1);
  }
}

//Function for check the filter quality
bool FilterMAPQ(string qual)
{
  //Converts the string to int
  int q = atoi(qual.c_str());

  //Check
  if(q < MinQ) { return false; }

  //Default, return true
  return true;
}

//Function for check the CIGAR
bool FilterCIGAR(string cigar)
{
  //Save the positions
  std::size_t found1 = cigar.find("S");
  std::size_t found2 = cigar.find("H");

  //Check if found1 or found2 is not std::string::npos (=== not fount)
  if(found1!=std::string::npos || found2!=std::string::npos)
  {
    //Return true, the cigar contains S or H
    return true;
  }

  //Default, return false
  return false;
}

//Main function
int main(int argc, char **argv)
{
  //Welcome
  cout << "Welcome to sam2sql v0.2" << endl;

  //Checl the number of arguments
  if(argc != 3)
  {
    //Exit with error
    cout << "Usage: ./sam2sql <PROJECT_ID> <PROJECT_FOLDERS>" << endl;
    exit(0);
  }

  //Save the ID
  string _id = argv[1];

  //Save the project folder
  string _url = argv[2];

  //Auxiliar files
  string aux = "", arr[N];

  //Print the ID
  cout << "Input ID: " << _id << endl;

  //For open the files
  ifstream input;
  ofstream output;

  //Input and output files
  string sam_file = _url + "/input.sam";
  string sql_file = _url + "/query.sql";

  //Open the files
	input.open(sam_file.c_str());
  output.open(sql_file.c_str());

  //Use the virus database
  output << "## Uses the virus database" << endl;
  output << "USE ismapper;" << endl << endl;

  //Create the new table
  output << "## Create the new table for the data" << endl;
  output << "CREATE TABLE data_" << _id << endl;
  output << "(" << endl;
  output << "id bigint(99) NOT NULL," << endl;
  output << "name varchar(255) NOT NULL," << endl;
  output << "chr varchar(2) NOT NULL," << endl;
  output << "start bigint(99) NOT NULL," << endl;
  output << "end bigint(99) NOT NULL," << endl;
  output << "mapq bigint(11) NOT NULL," << endl;
  output << "cigar varchar(255) NOT NULL," << endl;
  output << "seq text NOT NULL," << endl;
  output << "PRIMARY KEY (id)" << endl;
  output << ")" << endl;
  output << "ENGINE=InnoDB DEFAULT CHARSET=utf8;" << endl << endl;

  //Insert into database
  output << "## Insert reads into table" << endl;
  output << "INSERT INTO data_" << _id << " (id,name,chr,start,end,mapq,cigar,seq) VALUES " << endl;

  //Counter
  int count = 0;

  //Seq length
  int seqlength = 0;

  //Read the input file
  while(!input.eof())
  {
    //Get the line
    getline(input, aux);

    //Check if is NULL
    if(aux == "") { continue; }

    //Check if first character is a @
    if(aux[0] == '@') { continue; }

    //Converts string to array
    StringToArray(aux, arr);

    //Check for quality
    if(FilterMAPQ(arr[4]) == false){ continue; }

    //Check for CIGAR
    if(FilterCIGAR(arr[5]) == false){ continue; }

    //Check if we need a comma
    if(count > 0)
    {
      //Add a comma
      output << ", " << endl;
    }

    //Calculate the read length
    seqlength = atoi(arr[3].c_str()) + arr[9].length();

    //Add the values
    output << "(";
    output << "" << count << ",";      //ID
    output << "\"" << arr[0] << "\","; //NAME
    output << "\"" << arr[2] << "\","; //CHR
    output << "" << arr[3] << ",";     //POS (START)
    output << "" << seqlength << ",";  //END
    output << "" << arr[4] << ",";     //MAPQ
    output << "\"" << arr[5] << "\","; //CIGAR
    output << "\"" << arr[9] << "\""; //SEQ
    output << ")";

    //Increment the Counter
    count = count + 1;
  }

  //End the output file
  output << ";" << endl;

  //Update the project info
  output << "## Update the project table" << endl;
  output << "UPDATE project SET ready=1 WHERE id=\"" << _id << "\";" << endl << endl;

  //Close both files
  input.close();
  output.close();

  //Show the statistics
  cout << "Added " << count << " reads to the table 'data_" << _id << "'" << endl;

  //Exit
  return 0;
}

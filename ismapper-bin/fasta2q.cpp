//fasta2q.cpp -> Converts a fasta to fastq

//Import dependencies
#include <iostream>
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
using namespace std;

//Main function
int main(int argc, char **argv)
{
  //Welcome
  cout << "Welcome to fasta2q v0.1" << endl;

  //Checl the number of arguments
  if(argc != 2)
  {
    //Exit with error
    cout << "Usage: ./fasta2q <PROJECT_FOLDERS>" << endl;
    exit(0);
  }

  //Save the project folder
  string _url = argv[1];

  //Auxiliar strings
  string aux;

  //For open the files
  ifstream input;
  ofstream output;

  //Input and output file
  string input_file = _url + "/input.fasta";
  string output_file = _url + "/input.fastq";

  //Open the files
	input.open(input_file.c_str());
  output.open(output_file.c_str());

  //Read the input file
  while(!input.eof())
  {
    //Get the first line
    getline(input, aux);

    //Check if is NULL
    if(aux == "") { continue; }

    //Save to the file
    output << aux << endl; //Header

    //Get sequence
    getline(input, aux);

    //Save to the file
    output << aux << endl; //Sequence

    //Save the +
    output << "+" << endl; // +

    //Save the quality
    output << aux << endl; //Quality
  }

  //Close the input file
  input.close();

  //Close the output file
  output.close();

  //Exit
  return 0;
}

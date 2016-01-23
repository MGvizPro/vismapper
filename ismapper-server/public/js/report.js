//Params
var Params = {};

//Entrez url
Params.entrez = 'http://www.ncbi.nlm.nih.gov/gene/?term=';

//Filter by reads
Params.reads = {};
Params.reads.default = {}; //Default values
Params.reads.default.input = 0; //Default input value
Params.reads.input = 'filter-reads-input'; //Input for filter reads
Params.reads.send = 'filter-reads-send'; //Button for send the reads
Params.reads.reset = 'filter-reads-reset'; //Button for reset the reads

//Filter by distance
Params.distance = {};
Params.distance.default = {}; //Default values
Params.distance.default.select = 'gt'; //Default select value
Params.distance.default.input = 0; //Default input value
Params.distance.select = 'filter-distance-select'; //Select for filter by distance
Params.distance.input = 'filter-distance-input'; //Input for filter by distance
Params.distance.send = 'filter-distance-send'; //Button for send the distance
Params.distance.reset = 'filter-distance-reset'; //Button for reset the distance

//Data
var data = {'original': [], 'processed': []};

//Import data from server
$(document).ready(function(){

  //Make the request
  var _req = $.ajax({url: '/report/' + project + '/get', dataType: 'json'});

  //Done function
  _req.done(function(d){

    //Save the original data
    data.original = d;

    //Initialize the processed data
    data.processed = d;

    //Build the table
    ReportTable();

  });

  //Fail function
  _req.fail(function(){ alert('Unexpected error. Please, try again later.'); });

  //Add the events to the reads buttons
  $('#' + Params.reads.send).on('click', function(e){ ReadsFilter(); });
  $('#' + Params.reads.reset).on('click', function(e){ ReadsReset(); });

  //Add the events to the distance buttons
  $('#' + Params.distance.send).on('click', function(e){ DistanceFilter(); });
  $('#' + Params.distance.reset).on('click', function(e){ DistanceReset(); });

  //Event for input reads
  $('#' + Params.reads.input).keyup(function(e){ if(e.keyCode == 13){ ReadsFilter(); } });

  //Event for input distance
  $('#' + Params.distance.input).keyup(function(e){ if(e.keyCode == 13){ DistanceFilter(); } });
});

//Function for filter the data
function FilterData()
{
  //Initialize the data processed
  data.processed = [];

  //Read all the original data
  for(var i = 0; i < data.original.length; i++)
  {
    //Get the data
    var d = data.original[i];

    //Filter the number of reads
    if(d.num < readsVal.input) { continue; }

    //Filter by distance
    if(distVal.select === 'gt')
    {
      //Check for greater than
      if(d.genedistance < distVal.input) { continue; }
    }
    else
    {
      //Check for lower than
      if(d.genedistance > distVal.input) { continue; }
    }

    //Add the position
    data.processed.push(d);
  }

  //Build the table
  ReportTable();
}

//Table
var t = null;

//Table Style for links
var tableStyle = 'text-decoration:underline;color:#09a0f6';

//Function for create the table
function ReportTable()
{
  //Create the new table
  t = new jTables('report_table');

  //Table title
  t.Title('Full report');

  //Cols for the genes table
  t.AddColumn({'key':'chr','label':'Chr','align':'right'});
  t.AddColumn({'key':'start','label':'Position','align':'right'});
  t.AddColumn({'key':'strand','label':'Strand','align':'center'});
  t.AddColumn({'key':'count','label':'Reads','align':'right'});
  t.AddColumn({'key':'mapq','label':'Mean MapQ','align':'right'});
  t.AddColumn({'key':'leftg','label':'CLCG Name','align':'center'});
  t.AddColumn({'key':'leftd','label':'CLCG Distance','align':'right'});
  t.AddColumn({'key':'lefte','label':'CLCG Entrez','align':'center','style':tableStyle});
  t.AddColumn({'key':'rightg','label':'CRCG Name','align':'center'});
  t.AddColumn({'key':'rightd','label':'CRCG Distance','align':'right'});
  t.AddColumn({'key':'righte','label':'CRCG Entrez','align':'center','style':tableStyle});

  //Content
  t.Content(data.processed);

  //Callback
  t.Callback(function(row, col){

    //Check the column type
    if(col == 'lefte')
    {
      //View gene in entrez
      window.open(Params.entrez + row['lefte'], '_blank');
    }
    else if(col == 'righte')
    {
      //View gene in entrez
      window.open(Params.entrez + row['righte'], '_blank');
    }
    else
    {
      //Do the region for show
      var region = row['chr'] + ':' + row['start'] + '-' + row['start'];

      //Open a new window with the region
      window.open('/project/' + project + '/?r=' + region, '_blank');
    }
  });

  //Number of rows per page
  t.RowsPerPage([25, 50, 100]);

  //Show the table
  t.Create();
}

//Distance values
var distVal = {'input': 0, 'select': 'gt'};

//Function for filter by distance
function DistanceFilter()
{
  //Get the distance
  var distance = $('#' + Params.distance.input).val();

  //Get the select
  var selec = $('#' + Params.distance.select).val();

  //Check for null value
  if(distance === '') { return; }

  //Save the distance
  distVal.input = parseInt(distance);

  //Save the select
  distVal.select = selec;

  //Build the data
  FilterData();
}

//Reads reset
function DistanceReset()
{
  //Save the input value
  distVal.input = Params.distance.default.input;

  //Save the select value
  distVal.select = Params.distance.default.select;

  //Change the value
  $('#' + Params.distance.input).val('');

  //Build the data
  FilterData();
}

//Reads values
var readsVal = {'input': 0};

//Function for filter by reads
function ReadsFilter()
{
  //Get the number of reads
  var reads = $('#' + Params.reads.input).val();

  //Check for null value
  if(reads === '') { return; }

  //Save the number of reads
  readsVal.input = parseInt(reads);

  //Build the data
  FilterData();
}

//Reads reset
function ReadsReset()
{
  //Save the default value
  readsVal.input = Params.reads.default.input;

  //Change the value
  $('#' + Params.reads.input).val('');

  //Build the data
  FilterData();
}

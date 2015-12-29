/* Params values */
var Params = {};

//Server for specie
Params.specie = 'http://ismapper.babelomics.org:3051/human.json';

//Server for regions
Params.regions = '/ws/regions/' + projectId + '/';

//Server for reads
Params.reads = '/ws/reads/' + projectId + '/{region}';

//For find in database related to cancer
Params.db = {};
Params.db.genes = {}; //For find genes
Params.db.genes.region = '/ws/cancer/genes/by/region/{region}'; //Find cancer genes by region
Params.db.genes.name = '/ws/cancer/genes/by/name/'; //Find cancer genes by name
Params.db.genes.tumour = '/ws/cancer/genes/by/tumour/'; //Find cancer genes by tumour
Params.db.tumour = '/ws/cancer/tumours/'; //Find tumours by name

//Full list
Params.full = {};
Params.full.genes = '/ws/cancer/full/genes'; //Full cancer genes list
Params.full.tumours = '/ws/cancer/full/tumours'; //Full tumours list

//Default values
Params.default = {};
Params.default.minreads = ((projectId === 'demo')? 0 : 5); //Default Minimum number of reads
Params.default.chunk = 500000000; //Default Chunk size (def 500000000)
Params.default.time = 3000; //Default time for wait load complete

//Divs
Params.div = {};
Params.div.alert = 'alert_div'; //Alert div
Params.div.table = 'table_div'; //Table div

//Buttons
Params.btn = {};
Params.btn.filterReads = 'filter-reads'; //Button ID for min num of reads
Params.btn.findGenes = 'find-genes'; //Button ID for find genes
Params.btn.fullGenes = 'full-genes'; //Button ID for full list of genes
Params.btn.findTumours = 'find-tumours'; //Button ID for find tumours
Params.btn.fullTumours = 'full-tumours'; //Button ID for full list of tumours

//Inputs
Params.input = {};
Params.input.reads = 'input-reads'; //Input ID for reads
Params.input.genes = 'input-genes'; //Input ID for genes
Params.input.tumours = 'input-tumours'; //Input ID for tumours

//Margin for show regions
Params.margin = 5000; //Nucleotides margin

//Document ready
$(document).ready(function(){

  //Get the region
  var region = GetQuery().r;

  //Check for undefined
  if(typeof region !== 'undefined')
  {
    //Show alert
    AlertLoading();

    //Set time out
    setTimeout(function(){

      //Get the chromosome
      chr = region.split(':')[0];

      //Get the start
      start = Math.max(0, parseInt(region.split(':')[1].split('-')[0]) - Params.margin);

      //Get the end
      end = parseInt(region.split(':')[1].split('-')[1]) + Params.margin;

      //Go to region
      k.GoTo(chr + ':' + start + '-' + end);

      //Hide loading
      AlertClear();

    }, Params.default.time);
  }

  //Change the input reads value
  $('#' + Params.input.reads).val(Params.default.minreads);

  //Event for input reads
  $('#' + Params.input.reads).keyup(function(e){ if(e.keyCode == 13){ InputReads(); } });

  //Event for input genes
  $('#' + Params.input.genes).keyup(function(e){ if(e.keyCode == 13){ InputGenes(); } });

  //Event for input tumours
  $('#' + Params.input.tumours).keyup(function(e){ if(e.keyCode == 13){ InputTumours(); } });


  //Event for full genes list
  $('#' + Params.btn.fullGenes).on('click', function(e){ FullGenes(); });

  //Event for full tumours list
  $('#' + Params.btn.fullTumours).on('click', function(e){ FullTumours(); });


  //Event for apply the min reads filter
  $('#' + Params.btn.filterReads).on('click', function(e){ InputReads(); });

  //Event for find genes
  $('#' + Params.btn.findGenes).on('click', function(e){ InputGenes(); });

  //Event for find tumours
  $('#' + Params.btn.findTumours).on('click', function(e){ InputTumours(); })

});

//Var for the table
var t = null;

//Function for show the table for a gene
function TableGenes(data, title)
{
  //Create the new table
  t = new jTables(Params.div.table);

  //Table title
  t.Title(title);

  //Cols for the genes table
  t.AddColumn({'key':'gene','label':'Gene'});
  t.AddColumn({'key':'name','label':'Name'});
  t.AddColumn({'key':'chr','label':'Chr','align':'center'});
  t.AddColumn({'key':'start','label':'Start','align':'right'});
  t.AddColumn({'key':'end','label':'End','align':'right'});

  //Content
  t.Content(data);

  //Callback
  t.Callback(function(el, col){

    //Get the start position with margin
    var start = Math.max(0, el.start - Params.margin);

    //Get the end position with margin
    var end = el.end + Params.margin;

    //Go to region
    k.GoTo(el.chr + ':' + start + '-' + end);
  });

  //Show the table
  t.Create();

  //Add the class to the table
  $('#' + Params.div.table).addClass('dashboard-right-table');
}

//Table for tuours
function TableTumours(data, title)
{
  //Create the new table
  t = new jTables(Params.div.table);

  //Table title
  t.Title(title);

  //Cols for the genes table
  t.AddColumn({'key':'abbreviation','label':'Abbreviation'});
  t.AddColumn({'key':'term','label':'Term'});
  t.AddColumn({'key':'mutation','label':'Mutation'});
  t.AddColumn({'key':'count','label':'Genes','align':'right'});

  //Content
  t.Content(data);

  //Number of entries per page
  t.RowsPerPage([10, 15, 20]);

  //Row Callback
  t.Callback(function(el, col){ FindTerm(el.term); });

  //Show the table
  t.Create();

  //Add the class to the table
  $('#' + Params.div.table).addClass('dashboard-right-table');
}

//Function for clear the table
function TableClear()
{
  //Clear
  $('#' + Params.div.table).html('');

  //Clear the class
  $('#' + Params.div.table).removeClass('jtables');
  $('#' + Params.div.table).removeClass('jtables-closed');
  $('#' + Params.div.table).removeClass('dashboard-right-table');
}

//Function for show loading
function AlertLoading()
{
  //Create the div
  var div = '<div class="alert alert-orange">Wait...</div>';

  //Show the html
  $('#' + Params.div.alert).html(div);
}

//Function for show error
function AlertError(text)
{
  //Create the div
  var div = '<div class="alert alert-red alert-error">' + text + '</div>';

  //Show the html
  $('#' + Params.div.alert).html(div);
}

//Function for clear the alert
function AlertClear()
{
  //Clear
  $('#' + Params.div.alert).html('');
}

//Form Genes
function InputGenes()
{
  //Get the gene
  var gene = $('#' + Params.input.genes).val();

  //Check for empty gene
  if(gene !== '')
  {
    //Find gene
    FindGenes(gene);
  }
}

//Function for find gene
function FindGenes(gene)
{
  //Clear the table
  TableClear();

  //Make the request
  var _req = $.ajax({url: Params.db.genes.name + gene, dataType: 'json'});

  //Done function
  _req.done(function(data){

    //Create the new table
    TableGenes(data, 'Results for search "' + gene + '"');

    //Clear the alert
    AlertClear();
  });

  //Fail function
  _req.fail(function(){ AlertError('Unexpected error. Please, try again later.'); });

  //Show loading
  AlertLoading();
}

//Function for get the full list of genes
function FullGenes()
{
  //Clear the table
  TableClear();

  //Make the request
  var _req = $.ajax({url: Params.full.genes, dataType: 'json'});

  //Done function
  _req.done(function(data){

    //Create the new table
    TableGenes(data, 'Full OncoGenes list');

    //Clear the alert
    AlertClear();

  });

  //Fail function
  _req.fail(function(){ AlertError('Unexpected error. Please, try again later.'); });

  //Show loading
  AlertLoading();
}


//Form Tumour
function InputTumours()
{
  //Get the disease
  var tumour = $('#' + Params.input.tumours).val();

  //Check for tumour
  if(tumour !== '')
  {
    //Find
    FindTumours(tumour);
  }
}

//Function for find a tumour
function FindTumours(tumour)
{
  //Clear the table
  TableClear();

  //Make the request and get the full list
  var _req = $.ajax({url: Params.db.tumour + tumour, dataType: 'json'});

  //Done function
  _req.done(function(data){

    //Count the number of genes
    for(var i = 0; i < data.length; i++)
    {
      //Save the genes count
      data[i].count = data[i].genes.split(';').length;
    }

    //Show only the filtered list
    TableTumours(data, 'Results for search "' + tumour + '"');

    //Clear the alert
    AlertClear();

  });

  //Fail function
  _req.fail(function(){ AlertError('Unexpected error. Please, try again later.'); });

  //Show loading
  AlertLoading();
}

//Function for find a tumour by name
function FindTerm(tumour)
{
  //Clear the table
  TableClear();

  //Make the request
  var _req = $.ajax({url: Params.db.genes.tumour + tumour, dataType: 'json'});

  //Done function
  _req.done(function(data){

    //Show the genes for this tumour
    TableGenes(data[0].genes, 'Genes involved in "' + tumour + '"');

    //Clear the alert
    AlertClear();

  });

  //Fail function
  _req.fail(function(){ AlertError('Unexpected error. Please, try again later.'); });

  //Show loading
  AlertLoading();
}

//Function for get the full list of tumours
function FullTumours()
{
  //Clear the table
  TableClear();

  //Make the request
  var _req = $.ajax({url: Params.full.tumours, dataType: 'json'});

  //Done function
  _req.done(function(data){

    //Get count of genes
    for(var i = 0; i < data.length; i++)
    {
      //Save the genes count
      data[i].count = data[i].genes.split(';').length;
    }

    //Show the table
    TableTumours(data, 'Full Tumour Types list');

    //Clear the alert
    AlertClear();

  });

  //Fail function
  _req.fail(function(){ AlertError('Unexpected error. Please, try again later.'); });

  //Show loading
  AlertLoading();
}

//Function for filter regions by number of reads
function InputReads()
{
  //Hide the alert
  AlertClear();

  //Get the number
  var num = $('#' + Params.input.reads).val();

  //Parse to int
  num = parseInt(num);

  //Check for error
  if(isNaN(num) || num < 0)
  {
    //Show error and exit
    AlertError('Error, you must enter an integer positive');

    //Exit
    return false;
  }

  //Call to karyo for refresh the view
  k.ImportRegions(Params.regions + num);
}

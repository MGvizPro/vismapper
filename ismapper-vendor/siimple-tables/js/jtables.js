/**
 * jtables - Create tables with JavaScript using JSON data
 * @version v0.1.0
 * @link 
 * @license MIT
 */

//jTables main class
var jTables = function(parentd)
{
  //Parent info
  this.parent = {};
  this.parent.id = parentd; //Parent ID
  this.parent.class = 'jtables'; //Parent class
  this.parent.closed = 'jtables-closed'; //Parent closed class

  //Head content
  this.head = {};
  this.head.id = this.parent.id + '_head'; //Head ID
  this.head.class = 'jtables-head'; //Head class

  //Body content
  this.body = {};
  this.body.id = this.parent.id + '_body'; //Body ID
  this.body.class = 'jtables-body'; //Body class
  this.body.show = true; //Body show

  //Table title
  this.title = {};
  this.title.id = this.head.id + '_title'; //Table title id
  this.title.text = 'Test table'; //Title text
  this.title.class = 'jtables-title'; //Title class

  //Head arrow for show/hide the table
  this.arrow = {};
  this.arrow.id = this.head.id + '_arrow'; //Arrow ID
  this.arrow.class = 'jtables-arrow'; //Arrow class

  //Table vars
  this.table = {};
  this.table.id = this.parent.id + '_table'; //Table content id
  this.table.height = 0; //Table height
  this.table.class = 'jtables-table'; //Table class
  this.table.head = this.table.id + '_head'; //Table head ID
  this.table.body = this.table.id + '_body'; //Table body ID

  //Rows vars
  this.rows = {};
  this.rows.id = this.parent.id + '_row_'; //Row ID
  this.rows.height = 43; //Rows height
  this.rows.num = 5; //Number of rows
  this.rows.select = [5, 10, 20]; //Rows available for select

  //For save the data
  this.data = {};
  this.data.orig = []; //Original data
  this.data.procesed = null; //Procesed data

  //For sort the data
  this.sort = {};
  this.sort.col = -1; //Shorted column
  this.sort.order = 1; //Shor order
  this.sort.class = {};
  this.sort.class.default = 'jtables-sort'; //Default icon
  this.sort.class.asc = 'jtables-sort-asc'; //Asc icon
  this.sort.class.des = 'jtables-sort-des'; //Des incon

  //Columns
  this.cols = {};
  this.cols.id = this.parent.id + '_col_'; //Col ID
  this.cols.items = []; //For save the cols
  this.cols.num = 0; //Cols num

  //Callback
  this.callback = null; //Callback function

  //No data
  this.nodata = {};
  this.nodata.id = this.parent.id + '_nodata'; //No data ID
  this.nodata.class = 'jtables-nodata'; //No data class
  this.nodata.text = 'No data found'; //No data text

  //Pages info
  this.page = {};
  this.page.now = 0; //Page now
  this.page.num = 0; //Number of pages

  //Table foot
  this.foot = {};
  this.foot.id = this.parent.id + '_foot'; //Foot ID
  this.foot.class = 'jtables-foot'; //Foot class

  //Foot text
  this.foottext = {};
  this.foottext.page = this.foot.id + '_page'; //Foot text page ID
  this.foottext.pagec = 'jtables-foot-text jtables-foot-text-page'; //Foot text pages class
  this.foottext.total = this.foot.id + '_total'; //Foot text total ID
  this.foottext.totalc = 'jtables-foot-text jtables-foot-text-total'; //Foot text total class
  this.foottext.totalt = 'Total of rows: '; //Foot text total text

  //Foot buttons
  this.footbtn = {};
  this.footbtn.class = 'jtables-foot-btn'; //Foot buttons class
  this.footbtn.next = this.foot.id + '_next'; //Foot btn next ID
  this.footbtn.prev = this.foot.id + '_prev'; //Foot btn prev ID

  //Foot
  this.footrows = {};
  this.footrows.id = this.foot.id + '_rows'; //Foot rows ID
  this.footrows.show = true; //Show the foot rows block
  this.footrows.select = {}; //Foot Rows select
  this.footrows.select.id = this.footrows.id + '_select'; //Foot Rows select ID
  this.footrows.select.class = 'jtables-foot-rows-select'; //Foot rows select class
  this.footrows.text = {}; //Foot rows text
  this.footrows.text.id = this.footrows.id + '_text'; //Foot rows text ID
  this.footrows.text.class = 'jtables-foot-rows-text'; //Foot rows text class
  this.footrows.text.txt = 'Rows per page: '; //Foot rows text text
};

//jTable Initialize the table
jTables.prototype.Create = function()
{
  //Check the data
  if(this.data.orig === null)
  {
    //Show error
    console.error('jTables: first add content before create the table.');

    //Exit
    return false;
  }

  //Check the columns
  if(this.cols.items.length < 1)
  {
    //Show error
    console.error('jTables: first add the columns before create the table.');

    //Exit
    return false;
  }

  //Save the data to the procesed
  this.data.procesed = this.data.orig;

  //Build the div
  this.Build();

  //Initialize the pages
  this.PagesInit();

  //Show the page
  this.Page();

  //Add the foot events
  this.FootEvnt();

  //Show the total of rows
  this.FootShowTotal();

  //Add the Click arrow event
  this.ClickArrowEvnt();

  //Add the Click head event
  this.ClickHeadEvnt();
};

//jTables build the table
jTables.prototype.Build = function()
{
  //Initialize the table height
  //this.table.height = (this.rows.num + 1)*this.rows.height;

  //Initialize the div
  var div = '';

  //Head div
  div = div + '<div id="' + this.head.id + '" class="' + this.head.class + '">';

  //Show the title
  div = div + '<div class="' + this.title.class + '">' + this.title.text + '</div>';

  //Show the arrow
  div = div + '<div id="' + this.arrow.id + '" class="' + this.arrow.class + '"></div>';

  //Close the head div
  div = div + '</div>';


  //Body div
  div = div + '<div id="' + this.body.id + '" class="' + this.body.class + '">';


  //Table div
  div = div + '<div id="' + this.table.id + '">';

  //Create the new table
  div = div + '<table class="' + this.table.class + '">';

  //Create the table head
  div = div + '<thead id="' + this.table.head + '"><tr>';

  //Add the head content
  for(var j = 0; j < this.cols.items.length; j++)
  {
    //Add the column with the id
    div = div + '<td id="' + this.table.head + '_' + j + '" ';

    //Add the class
    div = div + 'class="' + this.sort.class.default + '" ';

    //Add the style
    //div = div + 'style="text-align:' + this.cols.items[j].align + '" ';

    //Close the column
    div = div + '>';

    //Add the column label
    div = div + this.cols.items[j].label;

    //Close the column
    div = div + '</td>';
  }

  //Close the head
  div = div + '</tr></thead>';

  //Create the table body
  div = div + '<tbody id="' + this.table.body + '"></tbody>';

  //Close the table
  div = div + '</table>';

  //Show no data div
  div = div + '<div id="' + this.nodata.id + '" class="' + this.nodata.class + '">' + this.nodata.text + '</div>';

  //Close the table div
  div = div + '</div>';


  //Foot div
  div = div + '<div id="' + this.foot.id +'" class="' + this.foot.class + '">';

  //Button for prev page
  div = div + '<div id="' + this.footbtn.prev + '" class="' + this.footbtn.class + '">Prev</div>';

  //Div for show the actual page
  div = div + '<div id="' + this.foottext.page + '" class="' + this.foottext.pagec + '"></div>';

  //Button for next page
  div = div + '<div id="' + this.footbtn.next + '" class="' + this.footbtn.class + '">Next</div>';

  //Check for show the rows select
  if(this.footrows.show === true)
  {
    //Show the rows text
    div = div + '<span class="' + this.footrows.text.class + '">' + this.footrows.text.txt + '</span>';

    //Select for rows
    div = div + '<select id="' + this.footrows.select.id + '" class="' + this.footrows.select.class + '">';

    //Add the rows available
    for(var i = 0; i < this.rows.select.length; i++)
    {
      div = div + '<option value="' + this.rows.select[i] + '">' + this.rows.select[i] + '</option>';
    }

    //Close the rows select
    div = div + '</select>';
  }

  //Span for show the total of items
  div = div + '<span id="' + this.foottext.total + '" class="' + this.foottext.totalc + '"></span>';

  //Close the foot div
  div = div + '</div>';

  //Close the body div
  div = div + '</div>';

  //Show the div
  $('#' + this.parent.id).html(div);

  //Set the parent div style
  $('#' + this.parent.id).addClass(this.parent.class);
};

//jTables foot rows change
jTables.prototype.FootRowsChange = function()
{
  //Get the number of rows
  this.rows.num = $('#' + this.footrows.select.id).val();

  //Initialize the pages
  this.PagesInit();

  //Show the page
  this.Page();
};

//jTables show page in foot
jTables.prototype.FootShowPage = function()
{
  //Calculate the real page
  var realp = this.page.now + 1;

  //Show page
  $('#' + this.foottext.page).text('Page ' + realp + ' of ' + this.page.num);
};

//jTables show total items
jTables.prototype.FootShowTotal = function()
{
  //Show total items
  $('#' + this.foottext.total).text(this.foottext.totalt + this.data.procesed.length);
};

//jTables foot events
jTables.prototype.FootEvnt = function()
{
  //Call the function for the buttons
  jTablesFootBtnEvnt(this);

  //Call the function for the select rows
  jTablesFootRowsEvnt(this);
};

//jTables foot click event */
function jTablesFootBtnEvnt(_main)
{
  //Create the event for the prev button
  $('#' + _main.footbtn.prev).on('click', function(e){ _main.PageRev(); });

  //Create the event for the next button
  $('#' + _main.footbtn.next).on('click', function(e){ _main.PageNext(); });
}

//jTables foot Rows select event
function jTablesFootRowsEvnt(_main)
{
  //Create the event for change the select value
  $('#' + _main.footrows.select.id).on('change', function(e){ _main.FootRowsChange(); });
}

//jTables Sort By column
jTables.prototype.SortBy = function(c)
{
  //Change the style for the old colum
  $('#' + this.table.head + '_' + this.sort.col).removeClass(this.sort.class.asc);
  $('#' + this.table.head + '_' + this.sort.col).removeClass(this.sort.class.des);

  //Check the column
  if(this.sort.col != c)
  {
    //Change the column
    this.sort.col = c;

    //Reset the order
    this.sort.order = 1;
  }
  else
  {
    //If the column is the same, change the order
    this.sort.order = (this.sort.order == 1)? -1 : 1;
  }

  //Sort the data by column
  this.data.procesed = ObjectSort(this.data.orig, this.cols.items[this.sort.col].key);

  //Check the order
  if(this.sort.order == -1)
  {
    //Reverse the array
    this.data.procesed.reverse();

    //Add the style for des
    $('#' + this.table.head + '_' + this.sort.col).addClass(this.sort.class.des);
  }
  else
  {
    //Add the style for asc
    $('#' + this.table.head + '_' + this.sort.col).addClass(this.sort.class.asc);
  }

  //Initialize the pages
  this.PagesInit();

  //Show the page
  this.Page();
};

//jTables initialize pages
jTables.prototype.PagesInit = function()
{
  //Cont the number of pages
  this.page.num = this.PagesCount();

  //Set the page now
  this.page.now = 0;
};

//jTables count the number of pages
jTables.prototype.PagesCount = function()
{
  //Counter var
  var i = 0;

  //Loop
  while(i*this.rows.num < this.data.orig.length)
  {
    //Increment the i
    i = i + 1;
  }

  //Return the index
  return i;
};

//jTables Next page
jTables.prototype.PageNext = function()
{
  //Add 1 to the page
  this.page.now = this.page.now + 1;

  //Check
  if(this.page.now >= this.page.num)
  {
    //Go back
    this.page.now = this.page.now - 1;
  }

  //Call the page
  this.Page();
};

//jTables prev page
jTables.prototype.PageRev = function()
{
  //Add -1 to the page
  this.page.now = this.page.now - 1;

  //Check
  if(this.page.now < 0)
  {
    //Go back
    this.page.now = 0;
  }

  //Call the page
  this.Page();
};

//jTables Change page
jTables.prototype.Page = function()
{
  //Initialize the output div
  var div = '';

  //Calculate the max values
  var maxi = Math.min(this.data.orig.length, this.rows.num*(this.page.now + 1))

  //Rows counter
  var count = 0;

  //Read all the content
  for(var i = this.rows.num*this.page.now; i < maxi; i++)
  {
    //Create the new row
    div = div + '<tr id="' + this.rows.id + count + '">';

    //Add the other cols
    for(var j = 0; j < this.cols.items.length; j++)
    {
      //Create the column with the align
      div = div + '<td id="' + this.cols.id + count + '_' + j + '" ';

      //Add the style for the column
      div = div + 'style="text-align:' + this.cols.items[j].align + '">';

      //Span for add the text style
      div = div + '<span style="' + this.cols.items[j].style + '">';

      //Add the content
      div = div + this.data.procesed[i][this.cols.items[j].key];

      //Close the span
      div = div + '</span>';

      //Close the column
      div = div + '</td>';
    }

    //Close the row
    div = div + '</tr>';

    //Increment the counter
    count = count + 1;
  }

  //Check for no data
  if(this.data.orig.length == 0)
  {
    //Show the no data div
    $('#' + this.nodata.id).css('display', 'block');
  }
  else
  {
    //Hide the no data div
    $('#' + this.nodata.id).css('display', 'none');
  }

  //Append to the table cont
  $('#' + this.table.body).html(div);

  //Show the page in the foot
  this.FootShowPage();

  //Add the click rows event
  this.ClickRowsEvnt();

  //Add the click row head event
  //this.ClickHeadEvnt();
};

//jTables - Function for set the callback
jTables.prototype.Callback = function(c)
{
  //Save the callback
  this.callback = c;
};

//jTables Do calback
jTables.prototype.DoCallback = function(r, c)
{
  //Get the real index
  var index = this.page.now*this.rows.num + r;

  //Show in console
  console.log('jTables: Callback for index ' + index);

  //Check for user callback
  if(this.callback)
  {
    //Make the custom callback
    this.callback(this.data.procesed[index], this.cols.items[c].key);
  }
};

//jTables Click Rows Event
jTables.prototype.ClickRowsEvnt = function()
{
  //For each row
  for(var i = 0; i < this.rows.num; i++)
  {
    //For each col
    for(var j = 0; j < this.cols.num; j++)
    {
      //Call the event
      jTablesClickRowsEvent(this, i, j);
    }
  }
};

//jTables Click Rows Action
jTables.prototype.ClickRowsAction = function(r, c)
{
  //Do the callback
  this.DoCallback(r, c);
};

//jTables Click Head Event
jTables.prototype.ClickHeadEvnt = function()
{
  //For each column
  for(var j = 0; j < this.cols.items.length; j++)
  {
    //Add the event to the column
    jTablesClickHeadEvent(this, j);
  }
};

//jTables Click head action
jTables.prototype.ClickHeadAction = function(c)
{
  //Sort by column
  this.SortBy(c);
};

//jTables Click Arrow Event
jTables.prototype.ClickArrowEvnt = function()
{
  //Set the click event to the arrow
  jTablesClickArrowEvent(this);
};

//jTables Click Arrow Action
jTables.prototype.ClickArrowAction = function()
{
  //Check the body status
  if(this.body.show === true)
  {
    //Add the closed class to the parent
    $('#' + this.parent.id).addClass(this.parent.closed);

    //Set body as not show
    this.body.show = false;
  }
  else
  {
    //Remove the closed class to the parent
    $('#' + this.parent.id).removeClass(this.parent.closed);

    //Set body as show
    this.body.show = true;
  }
};

//jTables click row event
function jTablesClickRowsEvent(_main, _r, _c)
{
  //Create the event
  $('#' + _main.cols.id + _r + '_' + _c).on('click', function(e){ _main.ClickRowsAction(_r, _c); });
}

//jTables click head event
function jTablesClickHeadEvent(_main, _n)
{
  //Create the event
  $('#' + _main.table.head + '_' + _n).on('click', function(e){ _main.ClickHeadAction(_n); });
}

//jTables click arrow event
function jTablesClickArrowEvent(_main)
{
  //Set the click
  $('#' + _main.arrow.id).on('click', function(e){ _main.ClickArrowAction(); });
}

//jTables set title
jTables.prototype.Title = function(tx)
{
  //Save the title
  this.title.text = tx;
};

//jTables add columns
jTables.prototype.AddColumn = function(co)
{
  //Check
  if(typeof co.key === 'undefined' || typeof co.label === 'undefined')
  {
    //Show error
    console.error('jTables: undefined key or label for column');
  }
  else
  {
    //Check the align
    if(typeof co.align === 'undefined')
    {
      //Default align
      co.align = 'left';
    }

    //Check the style
    if(typeof co.style === 'undefined')
    {
      //Default style
      co.style = '';
    }

    //Save the column
    this.cols.items.push(co);

    //Increment the columns
    this.cols.num = this.cols.num + 1;
  }
};

//jTables rows per page
jTables.prototype.RowsPerPage = function(n)
{
  //Check the type
  if(!Array.isArray(n))
  {
    //Convert n to array
    n = [n];
  }

  //Check the numbers
  for(var i = 0; i < n.length; i++)
  {
    //Check all numbers
    if(n[i] < 1)
    {
      //Show error
      console.log('jTables: please provide a number of rows per page > 0');

      //Exit
      return;
    }
  }

  //Save the array
  this.rows.select = n;

  //Save the first
  this.rows.num = n[0];
};

//jTables set content
jTables.prototype.Content = function(da)
{
  //Save the data
  this.data.orig = da;
};

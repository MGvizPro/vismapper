/**
 * karyojs - Chromosomal regions visualizer written in JavaScript
 * @version v1.0.0
 * @link http://biowt.github.io/karyojs
 * @license MIT
 */

//Karyo class
function Karyo(parent_id)
{
  //Version info
  this.info = {};
  this.info.name = 'Karyo.js'; //App name
  this.info.version = '1.0.0'; //Version ID
  this.info.web = 'https://biowt.github.io/karyojs'; //App website
  this.info.repo = 'https://github.com/biowt/karyojs/'; //Repository on GitHub
  this.info.docs = 'https://github.com/biowt/karyojs/wiki'; //Documentation

  //Database
  this.db = {};
  this.db.version = 'v1'; //Database version
  this.db.url = 'https://raw.githubusercontent.com/biowt/karyojs-species/{version}/{specie}.json';

  //Show the welcome on the console
  console.log('Karyo: ' + this.info.name + ' v' + this.info.version);
  console.log('Karyo: Visit ' + this.info.web + ' for more info and usage.');

  //Start the default values
  this.default = {};
  this.default.size = {'width': '100%', 'height': '250px'}; //Default width and height
  this.default.svg = {'width': '100%', 'height': '100%'}; //Default svg width and size
  this.default.img = 'img/'; //Images folder

  //Start the parent
  this.parent = {};
  this.parent.id = parent_id; //Parent ID
  this.parent.width = 0; //Parent width
  this.parent.height = 0; //Parent height

  //Core
  this.core = {};
  this.core.busy = false; //For core status

  //Start the navbar
  this.navbar = {};
  this.navbar.id = this.parent.id + '_navbar'; //Navbar ID
  this.navbar.width = 0; //Navbar width
  this.navbar.height = 50; //Navbar height
  this.navbar.show = true; //Show navbar
  this.navbar.class = 'karyo-navbar'; //Navbar css class
  this.navbar.padding = {"left": 10, "right": 10}; //Navbar padding
  this.navbar.btnKaryo = this.navbar.id + '_karyo'; //Karyo button ID
  this.navbar.btnKaryoClass = 'karyo-navbar-btn karyo-navbar-btn-home'; //Karyotype button css
  this.navbar.btnKaryoTitle = 'Return to karyotypes'; //Karyotype button title
  this.navbar.btnKaryoShow = true; //Karyotype button show
  this.navbar.btnSearch = this.navbar.id + '_search'; //Search button ID
  this.navbar.btnSearchClass = 'karyo-navbar-btn karyo-navbar-btn-search'; //Search button css
  this.navbar.btnSearchTitle = 'Find region'; //Search button title
  this.navbar.btnSearchShow = true; //Search button show
  this.navbar.btnTable = this.navbar.id + '_table'; //Table button ID
  this.navbar.btnTableClass = 'karyo-navbar-btn karyo-navbar-btn-table'; //Table button css
  this.navbar.btnTableTitle = 'Show/Hide table with all the regions'; //Table button title
  this.navbar.btnTableShow = true; //Table button show
  this.navbar.btnHelp = this.navbar.id + '_help'; //Help button ID
  this.navbar.btnHelpClass = 'karyo-navbar-btn karyo-navbar-btn-help'; //Help button class
  this.navbar.btnHelpTitle = 'Get help'; //Help button title
  this.navbar.btnHelpShow = true; //Help button show
  this.navbar.input = this.navbar.id + '_input'; //Input ID
  this.navbar.inputClass = 'karyo-navbar-input'; //Input css class
  this.navbar.inputPlaceholder = 'Find region'; //Input placeholder
  this.navbar.btnLogo = 'karyo-navbar-logo'; //Logo button css
  this.navbar.callbackBackBtn = null; //Go back callback
  this.navbar.callbackSearchBtn = null; //Search btn callback

  //Start the foot
  this.foot = {};
  this.foot.id = this.parent.id + '_foot'; //Foot ID
  this.foot.pos = this.foot.id + '_pos'; //Foot position ID
  this.foot.specie = this.foot.id + '_specie'; //Foot specie ID
  this.foot.width = 0; //Foot width
  this.foot.height = 30; //Foot height
  this.foot.padding = {"left": 10, "right": 10}; //Foot padding
  this.foot.show = true; //Show foot
  this.foot.logo = 'karyo-foot-logo'; //Karyo foot logo class
  this.foot.powered = 'karyo-foot-powered'; //Karyo powered by class

  //Start the svg
  this.svg = {};
  this.svg.id = this.parent.id + '_svg'; //Svg ID
  this.svg.build = null; //Svg starter
  this.svg.width = 0; //Svg width
  this.svg.height = 0; //Svg height
  this.svg.draw = null; //Svg draw container
  this.svg.margin = {'top': 35, 'bottom': 75, 'left': 70, 'right': 70}; //Svg margins

  //Start the specie
  this.specie = {};
  this.specie.el = null; //Array with the species
  this.specie.use = false; //For check if user uses the species
  this.specie.parser = null; //Function for parser the species

  //Start the region
  this.region = {};
  this.region.el = null; //Array with the regions
  this.region.use = false; //For check if user uses the regions
  this.region.parser = null; //Function for parser the species

  //Start the chromosome list info
  this.chrlist = {};
  this.chrlist.hover = false; //True if mouse is hover the chromosome
  this.chrlist.width = 12; //Chromosome width

  //Chromosome preview regions
  this.chrpreview = {};
  this.chrpreview.show = true; //Show preview region
  this.chrpreview.data = []; //Preview data
  this.chrpreview.op = 0.7; //Preview region opacity

  //Start the chromosome detail info
  this.chrdetail = {};
  this.chrdetail.hover = false; //True if mouse is hover the chromosome
  this.chrdetail.height = 60; //Chromosome height
  this.chrdetail.margin = -5; //Chromosome detail margin top

  //Start the chromosome title
  this.chrtitle = {};
  this.chrtitle.width = 400; //title width
  this.chrtitle.height = 35; //Title height
  this.chrtitle.margin = 20; //Title margin top
  this.chrtitle.show = true; //Show title

  //Start the species label
  this.chrlabel = {};
  this.chrlabel.width = 90; //Label width
  this.chrlabel.height = 30; //Label height
  this.chrlabel.parser = null; //Function for parser the chr label

  //Start the regions label
  this.reglabel = {};
  this.reglabel.parser = null; //Function for parser the reg labels
  this.reglabel.showPositions = true; //For show the positions
  this.reglabel.width = 130; //Label width
  this.reglabel.height = 20; //Label height

  //Start the region rectangle
  this.regrect = {};
  this.regrect.opacity = 0.4; //Rectangle opacity

  //Start the selected region
  this.select = {};
  this.select.op = 1.0; //Opacity for regions
  this.select.on = false; //Check if is activated
  this.select.chr = null; //Selected chr
  this.select.start = 0; //Select start point
  this.select.end = 0; //Select end point
  this.select.length = 0; //Select length
  this.select.move = false; //For check if user is selecting a region
  this.select.down = false; //For check if user has clicked on the region
  this.select.last = 0; //Last point for check direction
  this.select.lastx = 0; //Last position x
  this.select.margin = 5; //Margin for capture the click
  this.select.max = -1; //Max select region
  this.select.limitset = false; //For check if user has limited the select length
  this.select.enabled = true; //Select enabled

  //Select drag
  this.selectdrag = {};
  this.selectdrag.move = false; //Select drag move
  this.selectdrag.click = 0; //Select drag click position
  this.selectdrag.posx1 = 0; //Original position x1
  this.selectdrag.posx2 = 0; //Original position x2

  //Start the select rectangle
  this.selectrect = {};
  this.selectrect.opacity = 0.4; //Rectangle opacity

  //Start the select line
  this.selectline = {};
  this.selectline.opacity = 0.4; //Line opacity

  //Start the select label
  this.selectlabel = {};
  this.selectlabel.width = 130; //Width for the select label
  this.selectlabel.height = 20; //Height for the select label

  //Set the styles
  this.style = {};
  this.style.chrtext = {'family': 'OpenSans', 'size': '12px', 'anchor': 'middle', 'fill': '#546E7A'};
  this.style.titletext = {'family': 'OpenSans', 'size': '20px', 'anchor': 'middle', 'fill': '#546E7A'};
  this.style.hovertext = {'family': 'OpenSans', 'size': '12px', 'anchor': 'middle', 'fill': '#ffffff'};
  this.style.labeltext = {'family': 'OpenSans', 'size': '11px', 'anchor': 'middle', 'fill': '#ffffff'};

  //Alert
  this.alert = {};
  this.alert.id = this.parent.id + '_alert'; //Alert ID
  this.alert.padding = 40; //Alert padding for image
  this.alert.class = 'karyo-alert'; //Karyo alert class
  this.alert.width = 0; //Alert width
  this.alert.height = 0; //Alert Height
  this.alert.time = 4000; //Alert time visible
  this.alert.typeclass = 'karyo-alert-'; //Alert type class
  this.alert.type = ''; //Alert type
  this.alert.tip = true; //For show alert tip

  //Alert container
  this.alertcont = {};
  this.alertcont.id = this.alert.id + '_cont'; //Alert container ID
  this.alertcont.class = 'karyo-alert-cont'; //Karyo alert container class
  this.alertcont.visible = false; //Container is visible
  this.alertcont.width = 0; //Alert container width
  this.alertcont.height = 30; //Alert container height
  this.alertcont.posx = 0; //Alert container posx
  this.alertcont.posy = 0; //Alert contaeiner posy
  this.alertcont.margin = 5; //Alert container margin
  this.alertcont.padding = 35; //Alert container padding

  //Alert messages
  this.alertmsg = {};
  this.alertmsg.tip = 'Click on a red region to view, or click and drag to select a custom region.'; //Alert tip
  this.alertmsg.error = 'Error, region not found...'; //Alert search error

  //Cursor
  this.cursor = {};
  this.cursor.id = '#' + this.parent.id; //Cursor element
  this.cursor.active = false; //Cursor status

  //Loading window
  this.loading = {};
  this.loading.id = this.parent.id + '_loading'; //Loading ID
  this.loading.width = '100%'; //Loading height
  this.loading.height = 0; //Loading height
  this.loading.class = 'karyo-loading'; //Loading css class
  this.loading.show = true; //Loading show
  this.loading.visible = false; //Loading visible

  //Loading screen
  this.loadingscreen = {};
  this.loadingscreen.id = this.loading.id + '_screen'; //Loading screen ID
  this.loadingscreen.width = '100%'; //Loading screen width
  this.loadingscreen.height = 0; //Loading screen height
  this.loadingscreen.class = 'karyo-loading-screen'; //Loading screen css class
  this.loadingscreen.show = true; //Show true
  this.loadingscreen.padding = {"top": 100}; //Padding

  //Plugins
  this.plugins = {};

  //Callback
  this.callback = null;

  //Project status
  this.status = null;

  //Table track
  this.table = {};
  this.table.id = this.parent.id + '_table'; //Table ID
  this.table.class = 'karyo-table'; //Table class
  this.table.display = 'karyo-table-display'; //Table display
  this.table.head = 'karyo-table-head'; //Table head
  this.table.content = 'karyo-table-content'; //Table content
  this.table.active = true; //Table active
  this.table.show = true; //Table show
  this.table.width = '100%'; //Table width
  this.table.height = 200; //Table height
  this.table.select = 'Select a chromosome for view the full list.'; //Select chromosome text

  //Table empty
  this.tableempty = {};
  this.tableempty.class = 'karyo-table-empty'; //Table empty class
  this.tableempty.text = 'No regions for this chromosome.'; //Table empty text

  //Table rows
  this.tablerows = {};
  this.tablerows.class= 'karyo-table-row'; //Table row class
  this.tablerows.over = 'karyo-table-row-over'; //Table row over class

  //Table cols
  this.tablecols = {};
  this.tablecols.class = 'karyo-table-col'; //Cols class
  this.tablecols.num = 4; //Number of columns
  this.tablecols.names = ['Chr','Start','End','Label']; //Cols names
  this.tablecols.width = []; //Cols width
  this.tablecols.align = ['center', 'right', 'right', 'right']; //Cols align
  this.tablecols.parser = null; //Cols parser

  //Table open
  this.tableopen = {};
  this.tableopen.class = 'karyo-table-open'; //Open col
  this.tableopen.text = 'Open'; //Open text
  this.tableopen.show = true; //Open show
  this.tableopen.width = 150; //Open width

  //Karyo Build Time out
  KaryoBuildTimeOut(this);
}

//Karyo build
Karyo.prototype.Build = function()
{
  //Add the class to the parent
  $('#' + this.parent.id).addClass('karyo-parent');

  //Append the navbar
  $('#' + this.parent.id).append(this.NavbarBuild());

  //Append the loading div
  $('#' + this.parent.id).append(this.LoadingBuild());

  //Append the svg container
  $('#' + this.parent.id).append('<div id="' + this.svg.id + '"></div>');

  //Append the alert
  $('#' + this.parent.id).append(this.AlertBuild());

  //Append the table report
  $('#' + this.parent.id).append(this.TableBuild());

  //Append the foot
  $('#' + this.parent.id).append(this.FootBuild());

  //Set the default size
  this.SetSize(this.default.size.width, this.default.size.height);

  //Start the resize event
  this.EventResize();

  //Start the SVG
  this.svg.build = cSVG(this.svg.id).size(this.default.svg.width, this.default.svg.height);

  //Start mouse event
  this.Mouse();

  //Start the navbar events
  this.NavbarEvnt();

  //Check for draw
  this.Draw();
};

//Function for build
function KaryoBuildTimeOut(_main)
{
  setTimeout(function(){ _main.Build(); }, 200);
}

//Karyo Callback save
Karyo.prototype.CallBack = function(call)
{
  //Check the source
  if(typeof call === 'function')
  {
    //Show in console
    console.log('Karyo: saving callback');

    //Save the callback
    this.callback = call;
  }
  else
  {
    //Show error
    console.error('Karyo: Error in "Set Callback", callback is not a function');
  }
};

//Karyo Go back callback
Karyo.prototype.CallbackGoBack = function(call)
{
  //Check the source
  if(typeof call === 'function')
  {
    //Show in console
    console.log('Karyo: saving callback for go back button');

    //Save the callback for the go back button
    this.navbar.callbackBackBtn = call;
  }
  else
  {
    //Show error
    console.error('Karyo: Error in "Set Callback for Go Back Button", callback is not a function');
  }
};

//Karyo Search callback
Karyo.prototype.CallbackSearch = function(call)
{
  //Check the source
  if(typeof call === 'function')
  {
    //Show in console
    console.log('Karyo: saving callback for search button');

    //Save the callback for the go back button
    this.navbar.callbackSearchBtn = call;
  }
  else
  {
    //Show error
    console.error('Karyo: Error in "Set Callback for Search Button", callback is not a function');
  }
};

//Karyo Callback run
Karyo.prototype.CallbackRun = function(rstart, rend)
{
  //Get the chromosome
  if(typeof this.svg.draw.chr.id === 'undefined')
  {
    //Save from select
    var rchr = this.specie.el.chr[this.select.chr].id;
  }
  else
  {
    //Save the chromosome
    var rchr = this.svg.draw.chr.id;
  }

  //Check if callback exists
  if(this.callback !== null)
  {
    //Execute the callback
    this.callback(rchr, rstart, rend);
  }

  //Show by console
  console.log('Karyo: callback for "' + rchr + ':' + rstart + '-' + rend + '"');
};

//Karyo cursor hide
Karyo.prototype.CursorHide = function()
{
  //Delete the resize cursor
  $(this.cursor.id).removeClass('karyo-resize');

  //Delete the hand cursor
  $(this.cursor.id).removeClass('karyo-hand');

  //Delete the move cursor
  $(this.cursor.id).removeClass('karyo-move');

  //Set the cursor active as false
  this.cursor.active = false;
};

//Karyo Cursor
Karyo.prototype.Cursor = function(type)
{
  //Check the cursor active
  if(this.cursor.active === false)
  {
    //Set the cursor hand
    $(this.cursor.id).addClass('karyo-' + type);

    //Set active as true
    this.cursor.active = true;
  }
};

/* Karyo Foot builder */
Karyo.prototype.FootBuild = function()
{
  //Create the new div
  var div = '<div id="' + this.foot.id + '" class="karyo-foot"';

  //Check if is visible
  if(this.foot.show === false)
  {
    //Add display none
    div = div + ' style="display:none;"';
  }

  //Close the init div
  div = div + '>';

  //Crete the specie div
  div = div + '<div id="' + this.foot.specie + '" class="karyo-foot-specie">&nbsp;</div>';

  //Create the position div
  div = div + '<div id="' + this.foot.pos + '" class="karyo-foot-pos">&nbsp;</div>';

  //Create the logo div
  div = div + '<a href="' + this.info.web + '" class="' + this.foot.logo + '" target="_blank">';
  div = div + this.info.name + '</a>';

  //Create the powered by div
  div = div + '<div class="' + this.foot.powered + '">Powered by </div>';

  //Close the div
  div = div + '</div>';

  //Return the new div
  return div;

};

//Karyo foot show position
Karyo.prototype.FootPosition = function(pos)
{
  //Check for null
  if(pos === null)
  {
    //Set text as space
    var txt = '&nbsp;';
  }
  else
  {
    //Generate the new text
    var txt = this.svg.draw.chr.id + ':' + pos;
  }

  //Change the text
  $('#' + this.foot.pos).html(txt);
};

//Karyo foot specie
Karyo.prototype.FootSpecie = function()
{
  //Generate the specie text
  var txt = this.specie.el.name + ' (' + this.specie.el.assembly + ')';
  //Show
  $('#' + this.foot.specie).html(txt);
};

//Karyo Get Chromosome info
Karyo.prototype.GetChr = function(chr)
{
  //Find the selected ID
  for(var i = 0; i < this.specie.el.chr.length; i++)
  {
    //Check ID
    if(this.specie.el.chr[i].id === chr)
    {
      //Return the selected chromosome
      return this.specie.el.chr[i];
    }
  }

  //Default, return null
  return null;
};

//Karyo get Regions for chromosome
Karyo.prototype.GetRegionsByChr = function(chr)
{
  //Find the selected chr
  for(var i = 0; i < this.region.el.length; i++)
  {
    //Check ID
    if(this.region.el[i].id === chr)
    {
      //Return the regions
      return this.region.el[i].regions;
    }
  }

  //Default, return null
  return null;
}

//Karyo Import Chromosomes list
Karyo.prototype.ImportChrs = function(opt)
{
  //Check if user has set import from the Karyo database
  if(typeof opt.fromDB !== 'undefined')
  {
    //Convert to lower case
    opt.fromDB = opt.fromDB.toLowerCase();

    //User has set load chromosomes from database. Replace the specie
    opt.url = this.db.url.replace('{specie}', opt.fromDB);

    //Replace the database version
    opt.url = opt.url.replace('{version}', this.db.version);

    //Make the paser as null
    opt.parser = null;
  }

  //Call to the Import
  this.Import('specie', opt.url, opt.parser);
};

//Karyo Import Regions
Karyo.prototype.ImportRegions = function(opt)
{
  //Call to the Import
  this.Import('region', opt.url, opt.parser);
};

//Karyo Import from url
Karyo.prototype.Import = function(type, source, parser)
{
  //Show loading
  this.LoadingShow();

  //Set core as busy
  this.core.busy = true;

  //Check the parser
  if(typeof parser === 'undefined')
  {
    //Set parser as null
    parser = null;
  }

  //Set the use as true
  this[type].use = true;

  //Show info
  console.log('Karyo: reading ' + type + ' from ' + source);

  //Import the JSON file
  KaryoImportJson(type, source, parser, this);
};

//Specie Read
Karyo.prototype.ImportParser = function(type, data, parser)
{
  //Check if is necessary parse the data
  if(parser)
  {
    //Parse the data
    data = parser(data);
  }

  //Save the data
  this[type].el = data;

  //Check for specie
  if(type === 'specie')
  {
    //Show the specie by console
    console.log('Karyo: using ' + this.specie.el.name + ' with assembly ' + this.specie.el.assembly);
    console.log('Karyo: detected ' + this.specie.el.chr.length + ' chromosomes');
  }

  //Check for region
  if(type === 'region')
  {
    //Clear the preview
    this.chrpreview.data = [];
  }

  //Check for draw
  this.Draw();
};

//Function for import the data with jquery
function KaryoImportJson(_type, _json, _parser, _main)
{
  //Create the conection
  var _import = $.ajax({url: _json, dataType: 'json'});

  //Done function
  _import.done(function(data){ _main.ImportParser(_type, data, _parser); });

  //Fail function
  _import.fail(function(){ console.error('Karyo: Error reading from ' + _json); });
}

//Karyo Navbar builder
Karyo.prototype.NavbarBuild = function()
{
  //Create the new div
  var div = '<div id="' + this.navbar.id + '" class="' + this.navbar.class + '"';

  //Check if user has set navbar to null
  if(this.navbar.show === false)
  {
    //Add display none
    div = div + ' style="display:none;"';
  }

  //Close the init div
  div = div + '>';

  //Create the go back button
  if(this.navbar.btnKaryoShow === true)
  {
    //Create the div
    div = div + '<div class="' + this.navbar.btnKaryoClass + '" id="' + this.navbar.btnKaryo + '"';

    //Add the title
    div = div + 'title="' + this.navbar.btnKaryoTitle + '"';

    //Close the tiv
    div = div + '></div>';
  }

  //Create the search button and bar
  if(this.navbar.btnSearchShow === true)
  {
    //Create the text input for te search button
    div = div + '<input type="text" class="' + this.navbar.inputClass + '" id="' + this.navbar.input + '"';
    div = div + ' placeholder="' + this.navbar.inputPlaceholder + '">';

    //Create the div for the search button
    div = div + '<div class="' + this.navbar.btnSearchClass + '" id="' + this.navbar.btnSearch + '"';

    //Add the title
    div = div + 'title="' + this.navbar.btnSearchTitle + '"';

    //Close the button div
    div = div + '></div>';
  }

  //Create the table button
  if(this.navbar.btnTableShow === true && this.table.show === true)
  {
    //Create the div for the help button
    div = div + '<div class="' + this.navbar.btnTableClass + '" id="' + this.navbar.btnTable + '"';

    //Add the title
    div = div + 'title="' + this.navbar.btnTableTitle + '"';

    //Close the button div
    div = div + '></div>';
  }

  //Create the help button
  if(this.navbar.btnHelpShow === true)
  {
    //Create the div for the help button
    div = div + '<div class="' + this.navbar.btnHelpClass + '" id="' + this.navbar.btnHelp + '"';

    //Add the title
    div = div + 'title="' + this.navbar.btnHelpTitle + '"';

    //Close the button div
    div = div + '></div>';
  }

  //Close the div
  div = div + '</div>';

  //Return the new div
  return div;
};

//Karyo navbar event
Karyo.prototype.NavbarEvnt = function()
{
  //Start the navbar home button
  KaryoNavbarBtnHomeEvnt(this);

  //Start the navbar search button
  KaryoNavbarBtnSearchEvnt(this);

  //Start the navbar table button
  KaryoNavbarBtnTableEvnt(this);

  //Start the navbar help button
  KaryoNavbarBtnHelpEvnt(this);
};

//Karyo Home button Click
Karyo.prototype.NavbarBtnHomeClick = function()
{
  //Check core
  if(this.core.busy === true)
  {
    //Show in console
    console.warn('Karyo: Core is busy...');

    //Exit
    return false;
  }

  //Show by console
  console.log('Karyo: go back home');

  //Check for callback
  if(this.navbar.callbackBackBtn)
  {
    //Show in console
    console.log('Karyo: Calling function for Go Back button');

    //Call the callback function for the go back button
    this.navbar.callbackBackBtn();
  }

  //Go back to the chromosome view
  this.Draw();
};

//Karyo Search button click
Karyo.prototype.NavbarBtnSearchClick = function()
{
  //Check core
  if(this.core.busy === true)
  {
    //Show in console
    console.warn('Karyo: Core is busy...');

    //Exit
    return false;
  }

  //Get the region selected
  var regsel = $('#' + this.navbar.input).val();

  //Check
  if(regsel && regsel !== '')
  {
    //Show in console
    console.log('Karyo: searching "' + regsel + '"');

    //Check for callback at search button
    if(this.navbar.callbackSearchBtn)
    {
      //Show in console
      console.log('Karyo: Calling function for Search button');

      //Call the callback function for the go back button
      this.navbar.callbackSearchBtn(regsel);
    }

    //Send to the parse select
    this.SelectReg(regsel, true);
  }
};

//Karyo Table button click
Karyo.prototype.NavbarBtnTableClick = function()
{
  //Show/Hide the table
  this.TableShowHide();
}

//Karyo Help button click
Karyo.prototype.NavbarBtnHelpClick = function()
{
  //Open the help on a new window
  window.open(this.info.docs, '_blank');
}

//Navbar Home Event
function KaryoNavbarBtnHomeEvnt(_main)
{
  //If user clicks on the karyotypes button
  $('#' + _main.navbar.btnKaryo).click(function(e){ _main.NavbarBtnHomeClick(); });
}

//Karyo Navbar Search Event
function KaryoNavbarBtnSearchEvnt(_main)
{
  //If user clicks of search icon
  $('#' + _main.navbar.btnSearch).click(function(e){ _main.NavbarBtnSearchClick(); });

  //Or user press enter
  $('#' + _main.navbar.input).keyup(function(e){ if(e.keyCode == 13){ _main.NavbarBtnSearchClick(); } });
}

//Navbar Table Event
function KaryoNavbarBtnTableEvnt(_main)
{
  //If user clicks on the karyotypes button
  $('#' + _main.navbar.btnTable).click(function(e){ _main.NavbarBtnTableClick(); });
}

//Karyo Navbar Help Event
function KaryoNavbarBtnHelpEvnt(_main)
{
  //If user clicks on the help button
  $('#' + _main.navbar.btnHelp).click(function(e){ _main.NavbarBtnHelpClick(); });
}

//Resize function
Karyo.prototype.Resize = function()
{
  //Save the parent size
  this.parent.width = $('#' + this.parent.id).width();
  //this.parent.height = $('#' + this.parent.id).height();

  //Save the navbar size
  this.navbar.width = $('#' + this.navbar.id).width();
  this.navbar.height = $('#' + this.navbar.id).height();

  //Save the loading width and height
  this.loading.width = $('#' + this.loading.id).width();
  this.loading.height = $('#' + this.loading.id).height();

  //Save the svg size
  this.svg.width = $('#' + this.svg.id).width();
  this.svg.height = $('#' + this.svg.id).height();

  //Save the table size
  this.table.width = $('#' + this.table.id).width();
  //this.table.height = $('#' + this.table.id).height();

  //Save the foot size
  this.foot.width = $('#' + this.foot.id).width();
  this.foot.height = $('#' + this.foot.id).height();

  //Show resize window
  console.log('Karyo: resizing parent {width: ' + this.parent.width + ', height: ' + this.parent.height + '}');
  console.log('Karyo: resizing navbar {width: ' + this.navbar.width + ', height: ' + this.navbar.height + '}');
  console.log('Karyo: resizing svg {width: ' + this.svg.width + ', height: ' + this.svg.height + '}');
  console.log('Karyo: resizing foot {width: ' + this.foot.width + ', height: ' + this.foot.height + '}');

  //Resize the alert
  this.AlertResize();

  //Save the loading screen width and height
  this.LoadingResize();

  //Check for draw
  if(this.svg.build)
  {
    //Draw again
    this.Draw();
  }
};

//Event Resize
Karyo.prototype.EventResize = function()
{
  //Call the event
  KaryoEvntResize(this);
};

//Event for resize window
function KaryoEvntResize(_main)
{
  //Add the resize event
  $(window).resize(function(){ _main.Resize(); });
}

//Karyo select region parser
Karyo.prototype.SelectReg = function(r, force)
{
  //Check the force
  if(typeof force === 'undefined'){ force = false; }

  //Destroy the select
  this.SelectDestroy();

  //Return the opacity as true
  this.DrawChrDetailRegionsOp(1.0);

  //Split by :
  var split = r.split(':');

  //Check if is a chromosome
  var p = this.UtilFindID(this.specie.el.chr, split[0]);

  //Check if p === -1
  if(p < 0)
  {
    //Show error
    this.AlertError('Error, chromosome not found');

    //Exit
    return false;
  }

  //Check if user has set a chromosomical region
  if(split.length >= 2)
  {
    //Save the chromosome to the selected region
    this.select.chr = p;

    //Get the region
    var re = split[1].split('-');

    //Set the start position
    this.select.start = parseInt(re[0]);

    //Set the end position
    this.select.end = parseInt((re.length > 1)? re[1] : re[0]);

    //Check if end > chr.end
    if(this.select.end > this.specie.el.chr[this.select.chr].length)
    {
      //Show error
      console.log('Karyo: invalid region "' + r + '": end is bigger than chromosome');
      console.log('Karyo: settiong selected region end as chromosome end');

      //Change end
      this.select.end = this.specie.el.chr[this.select.chr].length;
    }

    //Check if start > end
    if(this.select.start > this.select.end)
    {
      //Show error
      console.log('Karyo: invalid region "' + r + '": start > end');

      //Destroy
      this.SelectDestroy();

      //Show error
      this.AlertError('Error, start > end');

      //return false
      return false;
    }

    //Select draw as true
    this.select.on = true;
  }

  //Check if chromosome is open
  if(this.status === 'detail' && this.svg.draw.chr.num === p)
  {
    //Draw only the selection
    if(this.select.on === true) { this.SelectDraw(); }
  }
  else
  {
    //Change chromosome view
    this.DrawChrDetail(p);
  }

  //Check for force callback
  if(force === true)
  {
    //Call the select callback
    this.SelectRunCallback();
  }
};

//Karyo select draw
Karyo.prototype.SelectDraw = function(anim)
{
  //Hide if exists
  this.SelectHide();

  //Start the new object
  var obj = {};

  //Calculate the select length
  this.select.length = this.select.end - this.select.start;

  //Save the position x1
  obj.posx1 = Math.floor(this.svg.draw.chr.width*(this.select.start/this.svg.draw.chr.length));
  obj.posx1 =  this.svg.draw.chr.posx + obj.posx1;

  //Save the position x2
  obj.posx2 = Math.floor(this.svg.draw.chr.width*(this.select.end/this.svg.draw.chr.length));
  obj.posx2 = this.svg.draw.chr.posx + obj.posx2;

  //Save the posy
  obj.posy = this.svg.draw.chr.posy;

  //Save the width and height
  obj.width = obj.posx2 - obj.posx1;
  obj.height = this.svg.draw.chr.height;

  //Create the rectangle
  obj.rect = this.svg.build.rect(obj.width, obj.height).attr({x: obj.posx1, y: obj.posy});

  //Add the style
  obj.rect.addClass('karyo-select-bg');

  //Add the opacity
  obj.rect.opacity(this.selectrect.opacity);

  //Add the thwo lines
  obj.line1 = this.svg.build.polyline([[obj.posx1, obj.posy], [obj.posx1, obj.posy + obj.height]]);
  obj.line2 = this.svg.build.polyline([[obj.posx2, obj.posy], [obj.posx2, obj.posy + obj.height]]);

  //Add the style for the lines
  obj.line1.addClass('karyo-select');
  obj.line2.addClass('karyo-select');

  //Add the opacity for the two lines
  obj.line1.opacity(this.selectline.opacity);
  obj.line2.opacity(this.selectline.opacity);

  //Save the object
  this.svg.draw.select = obj;

  //Create the object for the label
  obj = {};

  //Set the position
  obj.posx = this.svg.draw.select.posx1 + this.svg.draw.select.width/2;
  obj.posy = this.svg.draw.select.posy + this.svg.draw.chr.height + 10;

  //Create the rectangle
  obj.rect = this.svg.build.rect(this.selectlabel.width, this.selectlabel.height);

  //Set the position
  obj.rect.attr({x: obj.posx - this.selectlabel.width/2, y: obj.posy});

  //Set the triangle style
  obj.rect.addClass('karyo-selectlabel').radius(5);

  //Create the triangle
  obj.tri = this.svg.build.polygon([[obj.posx - 6, obj.posy + 2],[obj.posx, obj.posy - 6],[obj.posx + 6, obj.posy + 2]]);

  //Set the triangle style
  obj.tri.addClass('karyo-selectlabel');

  //Create the text
  obj.text = this.svg.build.text(this.select.start + '-' + this.select.end);

  //Move the text
  obj.text.attr({x: obj.posx, y: obj.posy + 1});

  //Change style
  obj.text.font(this.style.labeltext);

  //Save the object
  this.svg.draw.selectlabel = obj;

  //Check for animate
  if(anim === true)
  {
    //Add the opacity for the rectangle
    this.svg.draw.select.rect.opacity(0);

    //Add the animation for the rectangle
    this.svg.draw.select.rect.animate(200).opacity(this.selectrect.opacity);

    //Set the opacity for the lines
    this.svg.draw.select.line1.opacity(0);
    this.svg.draw.select.line2.opacity(0);

    //Add the animation for the lines
    this.svg.draw.select.line1.animate(200).opacity(this.selectline.opacity);
    this.svg.draw.select.line2.animate(200).opacity(this.selectline.opacity);

    //Add the opacity for the rectangle
    this.svg.draw.selectlabel.rect.opacity(0.0);

    //Add the animation for the label rect
    this.svg.draw.selectlabel.rect.animate(200).opacity(1.0);

    //Add the opacity for the triangle
    this.svg.draw.selectlabel.tri.opacity(0.0);

    //Add the animation for the triangle
    this.svg.draw.selectlabel.tri.animate(200).opacity(1.0);
  }
};

//Karyo Select run callback
Karyo.prototype.SelectRunCallback = function()
{
  //Execute the callback
  this.CallbackRun(this.select.start, this.select.end);

};

//Karyo Select Drag
Karyo.prototype.SelectDrag = function(x)
{
  //Change the on
  this.select.on = true;

  //Change move to true
  this.select.move = true;

  //Convert to real position
  var pos = this.DrawChrDetailRealPos(x);

  //Calculate the difference
  var diff = pos - this.selectdrag.click;

  //Restart the select start position
  this.select.start = this.selectdrag.posx1 + diff;

  //Restart the select end position
  this.select.end = this.selectdrag.posx2 + diff;

  //Check for the start position
  if(this.select.start < 0)
  {
    //Change the select start
    this.select.start = 0;

    //Change the select end
    this.select.end = this.select.start + this.select.length;
  }
  else if(this.select.end > this.svg.draw.chr.end)
  {
    //Change the select end
    this.select.end = this.svg.draw.chr.end;

    //Change the select start
    this.select.start = this.select.end - this.select.length;
  }

  //Draw the select
  this.SelectDraw(false);
};

//Karyo select move
Karyo.prototype.SelectMove = function(x)
{
  //For save the increment var
  var incr = 1;

  //Check if is first move
  if(this.select.move === false)
  {
    //Set the regions with less opacity
    //this.DrawChrDetailRegionsOp(this.select.op);

    //Change the on
    this.select.on = true;

    //Change move to true
    this.select.move = true;
  }

  //Convert to real position
  var pos = this.DrawChrDetailRealPos(x);

  //Check position x
  if(pos < this.select.start)
  {
    //Save as start
    this.select.start = pos;

    //Save the increment as 1
    incr = 1;
  }
  else if(pos > this.select.end )
  {
    //Save as end
    this.select.end = pos;

    //Save the increment as 0
    incr = 0;
  }
  else
  {
    //Check the direction
    if(this.select.last - pos < -1)
    {
      //Change the end
      this.select.start = pos;

      //Save the increment as 1
      incr = 1;
    }
    else if(this.select.last - pos > 1)
    {
      //Change the start
      this.select.end = pos;

      //Save the increment as 0
      incr = 0;
    }
  }

  //Check for limit region
  if(this.select.max > -1 && this.select.end - this.select.start > this.select.max)
  {
    //Restart the select end or start
    if(incr === 1)
    {
      //Restart the start
      this.select.start = this.select.end - this.select.max;
    }
    else
    {
      //Restart the end
      this.select.end = this.select.start + this.select.max;
    }
  }

  //Save the last
  this.select.last = pos;

  //Draw the select
  this.SelectDraw(false);
};

//Karyo restart select region
Karyo.prototype.SelectDestroy = function()
{
  //Restart the default vars
  this.select.chr = null;
  this.select.start = 0;
  this.select.end = 0;
  this.select.on = false;
  this.select.run = false;
  this.select.hover = false;
  this.select.down = false;

  //Hide
  this.SelectHide();
};

//Karyo select hide
Karyo.prototype.SelectHide = function()
{
  //Check if svg is created
  if(this.svg.draw !== null)
  {
    //Check if svg select is undefined or null
    if(typeof this.svg.draw.select !== 'undefined' && this.svg.draw.select !== null)
    {
      //Remove all the svgs
      this.svg.draw.select.rect.remove();
      this.svg.draw.select.line1.remove();
      this.svg.draw.select.line2.remove();

      //Set as null
      this.svg.draw.select = null;

      //Remove all the labels
      this.svg.draw.selectlabel.rect.remove();
      this.svg.draw.selectlabel.text.remove();
      this.svg.draw.selectlabel.tri.remove();

      //Set as null
      this.svg.draw.selectlabel = null;
    }
  }
};

//Set Karyo size
Karyo.prototype.SetSize = function(w, h)
{
  //Resize the parent div
  $('#' + this.parent.id).width(w);
  //$('#' + this.parent.id).height(h);

  //Calculate the width for the navbar
  var navw = 'calc(' + w + ' - ' + this.navbar.padding.left + 'px - ' + this.navbar.padding.right + 'px)';

  //Resize the navbar
  $('#' + this.navbar.id).css('width', navw);
  $('#' + this.navbar.id).height(this.navbar.height);

  //Set the navbar padding
  $('#' + this.navbar.id).css('padding-left', this.navbar.padding.left);
  $('#' + this.navbar.id).css('padding-right', this.navbar.padding.right);

  //Resize the svg
  $('#' + this.svg.id).width(w);
  $('#' + this.svg.id).height(parseInt(h));

  //Resize the table
  $('#' + this.table.id).width(this.table.width);
  //$('#' + this.table.id).height(this.table.height);

  //Check for show
  $('#' + this.table.id).css('display', (this.table.show === true)? 'block': 'none');

  //Resize the loading div
  $('#' + this.loading.id).width(this.loading.width);
  $('#' + this.loading.id).height(this.loading.height);

  //Resize the loading screen div
  $('#' + this.loadingscreen.id).width(this.loadingscreen.width);
  $('#' + this.loadingscreen.id).height(this.loadingscreen.height);

  //Calculate the width for the foot
  var foow = 'calc(' + w + ' - ' + this.foot.padding.left + ' - ' + this.foot.padding.right + ')';

  //Resize the foot
  $('#' + this.foot.id).css('width', foow);
  $('#' + this.foot.id).height(this.foot.height);

  //Set the navbar padding
  $('#' + this.foot.id).css('padding-left', this.foot.padding.left);
  $('#' + this.foot.id).css('padding-right', this.foot.padding.right);

  //Set the line Height
  $('#' + this.foot.id).css('line-height', '' + this.foot.height + 'px');

  //Call the resize event
  this.Resize();
};

//Karyo Use size
Karyo.prototype.UseSize = function(obj)
{
  //Check for width
  if(typeof obj.width !== 'undefined') { this.default.size.width = obj.width; }

  //Check for height
  if(typeof obj.height !== 'undefined') { this.default.size.height = obj.height; }
}

//Karyo Use margins
Karyo.prototype.UseMargin = function(obj)
{
  //Check for top
  if(typeof obj.top !== 'undefined') { this.svg.margin.top = obj.top; }

  //Check for bottom
  if(typeof obj.bottom !== 'undefined') { this.svg.margin.bottom = obj.bottom; }

  //Check for left
  if(typeof obj.left !== 'undefined') { this.svg.margin.left = obj.left; }

  //Check for right
  if(typeof obj.right !== 'undefined') { this.svg.margin.right = obj.right; }
}

//Karyo Use plugins
Karyo.prototype.UsePlugin = function(name, callback)
{
  //Seng to the plugins function
  this.Plugins(name, callback);
};

//Karyo GoTo region
Karyo.prototype.GoTo = function(go, call)
{
  //Check call
  if(typeof call === 'undefined') { call = true; }

  //Check core
  if(this.core.busy === true)
  {
    //Show in console
    console.warn('Karyo: Core is busy...');

    //Exit
    return;
  }

  //Open region
  this.SelectReg(go, call);
};

//Karyo Label functions
Karyo.prototype.UseLabel = function(opt)
{
  //Check label for chromosome
  if(typeof opt.chromosome === 'function')
  {
    //Save the chromosomes region parser
    this.chrlabel.parser = opt.chromosome;
  }

  //Check label for region
  if(typeof opt.region === 'function')
  {
    //Save the regions label parser
    this.reglabel.parser = opt.region;
  }
};

//Karyo Options
Karyo.prototype.Options = function(opt)
{
  //Check preview regions
  if(typeof opt.previewRegions !== 'undefined'){ this.chrpreview.show = opt.previewRegions; }

  //Check navbar height
  if(typeof opt.navbarHeight !== 'undefined'){ this.navbar.height = opt.navbarHeight; }

  //Check navbar show
  if(typeof opt.navbarShow !== 'undefined'){ this.navbar.show = opt.navbarShow; }

  //Check navbar show karyotype button
  if(typeof opt.navbarShowKaryo !== 'undefined'){ this.navbar.btnKaryoShow = opt.navbarShowKaryo; }

  //Check navbar show search button
  if(typeof opt.navbarShowSearch !== 'undefined'){ this.navbar.btnSearchShow = opt.navbarShowSearch; }

  //Check navbar show table button
  if(typeof opt.navbarShowTable !== 'undefined'){ this.navbar.btnTableShow = opt.navbarShowTable; } 

  //Check navbar show help button
  if(typeof opt.navbarShowHelp !== 'undefined'){ this.navbar.btnHelpShow = opt.navbarShowHelp; }

  //For show the tip alert
  if(typeof opt.tipShow !== 'undefined'){ this.alert.tip = opt.tipShow; }

  //For personalize the tip message
  if(typeof opt.tipText !== 'undefined'){ this.alertmsg.tip = opt.tipText; }

  //Select max region
  if(typeof opt.selectMax !== 'undefined'){ this.select.max = opt.selectMax; }

  //Select enabled
  if(typeof opt.selectEnabled !== 'undefined'){ this.select.enabled = opt.selectEnabled; }

  //Show report table
  if(typeof opt.showTable !== 'undefined'){ this.table.show = opt.showTable; }
};

//Utils main function
Karyo.prototype.UtilFindID = function(_arr, _id)
{
  //Read all
  for(var i = 0; i < _arr.length; i++)
  {
    //Check
    if(_arr[i].id === _id) return i;
  }

  //Return -1
  return -1;
};

//Karyo check region hover
Karyo.prototype.UtilRegHover = function(x, y, px, py, w, h)
{
  //Check posx
  if( px <= x && x <= px + w )
  {
    //Check posy
    if( py <= y && y <= py + h)
    {
      //Return true
      return true;
    }
  }

  //Return false
  return false;
};

//Karyo check if var is a function
Karyo.prototype.isFunction = function(x)
{
  //Return
  return Object.prototype.toString.call(x) == '[object Function]';
};

//Karyo generate ID
Karyo.prototype.GenID = function()
{
  //Get a random string
	return Math.random().toString(36).slice(2).substr(0, 5);
};

//Karyo Check near
Karyo.prototype.PosNear = function(x, pos, margin)
{
  //Check
  if( pos - margin <= x && x <= pos + margin)
  {
    //Return true
    return true;
  }

  //default
  return false;
};

//Karyo loading div build
Karyo.prototype.LoadingBuild = function()
{
  //Create the new div
  var div = '<div id="' + this.loading.id + '" class="' + this.loading.class + '">';

  //Create the screen
  div = div + '<div id="' + this.loadingscreen.id + '" class="' + this.loadingscreen.class + '" ';

  //Set the screen style
  div = div + 'style="opacity:0.0; visibility:hidden; padding-top:' + this.loadingscreen.padding.top + '">';

  //Create the animation
  div = div + '<div class="karyo-anim"></div>';

  //Close the screen div
  div = div + '</div>';

  //Close the main div
  div = div + '</div>';

  //Return the div
  return div;
};

//Karyo loading resize
Karyo.prototype.LoadingResize = function()
{
  //Save the width
  this.loadingscreen.width = $('#' + this.loadingscreen.id).width();

  //Calculate the height
  this.loadingscreen.height = this.svg.height - this.loadingscreen.padding.top;

  //Set the loading screen height
  $('#' + this.loadingscreen.id).height(this.loadingscreen.height);
};

//Karyo Show loading
Karyo.prototype.LoadingShow = function()
{
  //Show in console
  //console.log('Karyo: loading ON');

  //Change the opacity
  $('#' + this.loadingscreen.id).css('opacity', '1.0');

  //Change the visibility
  $('#' + this.loadingscreen.id).css('visibility', 'visible');

  //Set visible as true
  this.loading.visible = true;
};

//Karyo Hide loading
Karyo.prototype.LoadingHide = function()
{
  //Show in console
  //console.log('Karyo: loading OFF');

  //Check for visible
  if(this.loading.visible === true)
  {
    //Change the opacity
    $('#' + this.loadingscreen.id).css('opacity', '0.0');

    //Change the visibility
    $('#' + this.loadingscreen.id).css('visibility', 'hidden');
  }

  //Set visible as false
  this.loading.visible = false;
};

//Karyo alert div build
Karyo.prototype.AlertBuild = function()
{
  //Create the new div
  var div = '<div id="' + this.alert.id + '" class="' + this.alert.class + '">';

  //Create the alert container div
  div = div + '<div class="' + this.alertcont.class + '" id="' + this.alertcont.id + '" ';

  //Add the alert container style
  div = div + 'style="opacity: 0.0; visibility: hidden; padding-left: ' + this.alertcont.padding + 'px;"';

  //Close the alert container div
  div = div + '></div>';

  //Close the alert div
  div = div + '</div>';

  //Return the new div
  return div;
};

//Karyo Alert resize
Karyo.prototype.AlertResize = function()
{
  //Calculate the size
  this.alertcont.width = this.svg.width - this.svg.margin.left - this.svg.margin.right;

  //Add the padding
  this.alertcont.width = this.alertcont.width - this.alertcont.padding;

  //Calculate the posx
  this.alertcont.posx = this.svg.margin.left;

  //Calculate the position
  this.alertcont.posy = (-1)*(this.alertcont.height + this.alertcont.margin);

  //Change the div width
  $('#' + this.alertcont.id).css('width', this.alertcont.width);

  //Change the div height
  $('#' + this.alertcont.id).css('height', this.alertcont.height);

  //Change the div top
  $('#' + this.alertcont.id).css('top', this.alertcont.posy);

  //Change the div left
  $('#' + this.alertcont.id).css('left', this.alertcont.posx);
};

//Karyo Alert Tip Creator
Karyo.prototype.AlertTip = function()
{
  //Check for alert tip
  if(this.alert.tip === true)
  {
    //Create the tip
    this.AlertShow('tip', this.alertmsg.tip);
  }
};

//Karyo alert error
Karyo.prototype.AlertError = function()
{
  //Create the error
  this.AlertShow('error', this.alertmsg.error);
};

//Karyo Alert alert show
Karyo.prototype.AlertShow = function(type, text)
{
  //Check if is visible
  if(this.alertcont.visible == false)
  {
    //Change the text
    $('#' + this.alertcont.id).text(text);

    //Save the type
    this.alert.type = type;

    //Add the type class
    $('#' + this.alertcont.id).addClass(this.alert.typeclass + this.alert.type);

    //Change the display
    //$('#' + this.alertcontid).css('display', 'block');

    //Change the opacity
    $('#' + this.alertcont.id).css('opacity', '1.0');

    //Change the visibility
    $('#' + this.alertcont.id).css('visibility', 'visible');

    //Set to visible
    this.alertcont.visible = true;

    //Set the time out
    KaryoAlertTimeOut(this);
  }
};

//Karyo alert Show/hide
Karyo.prototype.AlertHide = function()
{
  //Hide the alert
  //$('#' + this.alertcont.id).css('display', 'none');

  //Change the opacity
  $('#' + this.alertcont.id).css('opacity', '0.0');

  //Change the visibility
  $('#' + this.alertcont.id).css('visibility', 'hidden');

  //Remove the type class
  $('#' + this.alertcont.id).removeClass(this.alert.typeclass + this.alert.type);

  //Set as hide
  this.alertcont.visible = false;
};

//Karyo alert error time out
function KaryoAlertTimeOut(_main)
{
  //Set the time out
  setTimeout(function(){ _main.AlertHide(); }, _main.alert.time);
}

//Karyo make the preview regions
Karyo.prototype.Preview = function()
{
  //Show in console
  console.log('Karyo: Creating preview regions...');
  
  //Get the number of chromosomes
  var num = this.specie.el.chr.length;

  //Calculates the chromosome height
  var chr_height = this.svg.height - this.svg.margin.top - this.svg.margin.bottom;

  //Get the maxium value
  var chr_max = KaryoMaxChrLength(this.specie.el.chr);

  //Read all the chromosomes
  for(var i = 0; i < num; i++)
  {
    //Create the new array with the regions
    var arr = [];

    //Create the chromosome height
    var h = Math.floor(chr_height*this.specie.el.chr[i].length/chr_max);

    //Get the ID for this chr
    var r = this.UtilFindID(this.region.el, this.specie.el.chr[i].id);

    //Check if region exists
    if( r > -1)
    {
      //Array with the points
      var points = [];

      //Add the regions
      for(var j = 0; j < this.region.el[r].regions.length; j++)
      {
        //Save the region
        var reg = this.region.el[r].regions[j];

        //Calculate the first position
        var pos1 = Math.floor(h*(reg.start/this.specie.el.chr[i].length));

        //Calculate the second position
        var pos2 = Math.floor(h*(reg.end/this.specie.el.chr[i].length));

        //Save all the points
        for(var k = pos1; k <= pos2; k++){ points.push(k); }
      }

      //Sort the array with the points
      points.sort(function(a,b){ return a - b; });

      //Counter for read all the points
      var k = 0;

      //Read all the points
      while(k < points.length)
      {
        //Get the start and end
        var start = points[k];
        var end = points[k];

        //Next point
        k = k + 1;

        //Check the next points
        while(k < points.length)
        {
          //Check the next point
          if(end + 1 < points[k]){ break; }

          //Save the point
          end = points[k];

          //Get the next
          k = k + 1;
        }

        //Check if start point and end is the same
        if(start == end){ end = end + 1; }

        //Add to the array
        arr.push([start, end]);
      }
    }

    //Add the array to the list of previews
    this.chrpreview.data.push(arr);
  }
};

//Draw chromosome detail
Karyo.prototype.DrawChrDetail = function(n)
{
  //Show the alert tip
  this.AlertTip();

  //Restart the svg
  this.svg.build.clear();

  //Restart the container
  this.svg.draw = {};

  //Start the chromosome
  this.svg.draw.chr = {};

  //Save the num
  this.svg.draw.chr.num = n;

  //Save the ID
  this.svg.draw.chr.id = this.specie.el.chr[n].id;

  //Save the start and end
  this.svg.draw.chr.start = 0;
  this.svg.draw.chr.end = this.specie.el.chr[n].length;

  //Save the length
  this.svg.draw.chr.length = this.svg.draw.chr.end - this.svg.draw.chr.start;

  //Save the width and height
  this.svg.draw.chr.width = this.svg.width - this.svg.margin.left - this.svg.margin.right;
  this.svg.draw.chr.height = this.chrdetail.height;

  //Save the position
  this.svg.draw.chr.posx = this.svg.margin.left;
  this.svg.draw.chr.posy = Math.floor(this.svg.height/2 - this.svg.draw.chr.height/2 - this.chrdetail.margin);

  //Draw the chromosome
  this.svg.draw.chr.svg = this.svg.build.rect(this.svg.draw.chr.width, this.svg.draw.chr.height);

  //Move the chromosome
  this.svg.draw.chr.svg.attr({x: this.svg.draw.chr.posx, y: this.svg.draw.chr.posy});

  //Set the style
  this.svg.draw.chr.svg.addClass('karyo-chr').opacity(0.0);

  //Set the radius
  this.svg.draw.chr.svg.radius(20);

  //Animate
  this.svg.draw.chr.svg.animate(200).opacity(1.0);


  //Initialize the title
  this.svg.draw.title = null;

  //Check
  if(this.chrtitle.show === true)
  {
    //Initialize
    this.svg.draw.title = {};

    //Draw the title rectangle
    this.svg.draw.title.rect = this.svg.build.rect(this.chrtitle.width, this.chrtitle.height);

    //Set the position
    this.svg.draw.title.rect.attr({ x: this.svg.width/2 - this.chrtitle.width/2, y: this.chrtitle.margin});

    //Set the style
    this.svg.draw.title.rect.addClass('karyo-title').radius(5);

    //Create the title text
    var txt = 'Chromosome ' + this.svg.draw.chr.id + ':' + this.svg.draw.chr.start + '-' + this.svg.draw.chr.end;

    //Create the title
    this.svg.draw.title.text = this.svg.build.text(txt);

    //Change the style
    this.svg.draw.title.text.font(this.style.titletext);

    //Move the text
    this.svg.draw.title.text.attr({ x: this.svg.width/2, y: this.chrtitle.margin});
  }

  //Initialize the centromere
  this.svg.draw.centromere = null;

  //Check if centromere is defined
  if(this.specie.el.chr[n].centromere)
  {
    //Create the new object
    var obj = {};

    //Save the positions
    obj.posx1 = Math.floor(this.svg.draw.chr.width*(this.specie.el.chr[n].centromere[0]/this.svg.draw.chr.length));
    obj.posx2 = Math.floor(this.svg.draw.chr.width*(this.specie.el.chr[n].centromere[1]/this.svg.draw.chr.length));
    obj.posy = this.svg.draw.chr.posy;

    //Save the width and height
    obj.width = obj.posx2 - obj.posx1;
    obj.height = this.svg.draw.chr.height;

    //Create the rectangle
    obj.rect = this.svg.build.rect(obj.width, obj.height + 6).attr({x: obj.posx1, y: obj.posy - 3});

    //Add the style
    obj.rect.addClass('karyo-centromere-bg');

    //Create the polygon
    var poly = [];
    poly.push([obj.posx1, obj.posy]);
    poly.push([obj.posx1 + obj.width/2, obj.posy + obj.height/2]);
    poly.push([obj.posx1 + obj.width, obj.posy]);
    poly.push([obj.posx1 + obj.width, obj.posy + obj.height]);
    poly.push([obj.posx1 + obj.width/2, obj.posy + obj.height/2]);
    poly.push([obj.posx1, obj.posy + obj.height]);

    //Create the polygon
    obj.poly = this.svg.build.polygon(poly);

    //Set the class
    obj.poly.addClass('karyo-centromere').opacity(0.0);

    //Set the animation
    obj.poly.animate(200).opacity(1.0);

    //Save
    this.svg.draw.centromere = obj;
  }

  //Initialize the regions
  this.svg.draw.region = {};

  //Initialize the regions container
  this.svg.draw.region.regs = [];

  //Add the regions
  if(this.region)
  {
    //Get the ID for this chr
    var r = this.UtilFindID(this.region.el, this.svg.draw.chr.id);

    //Check if region exists
    if( r > -1)
    {
      //Save the region index
      this.svg.draw.region.index = r;

      //Initialize the opacity for the rectangle
      var opr = (this.select.on === true) ? this.select.op : this.regrect.opacity;

      //Initialize the opacity for the lines
      var opl = (this.select.on === true) ? this.select.op : 1.0;

      //Add the regions
      for(var i = 0; i < this.region.el[r].regions.length; i++)
      {
        //Save the region
        var reg = this.region.el[r].regions[i];

        //Create the new object
        var obj = {};

        //Create the time
        var time = 500;

        //Save the position x1
        obj.posx1 = Math.floor(this.svg.draw.chr.width*(reg.start/this.svg.draw.chr.length));
        obj.posx1 =  this.svg.draw.chr.posx + obj.posx1;

        //Save the position x2
        obj.posx2 = Math.floor(this.svg.draw.chr.width*(reg.end/this.svg.draw.chr.length));
        obj.posx2 = this.svg.draw.chr.posx + obj.posx2;

        //Save the posy
        obj.posy = this.svg.draw.chr.posy;

        //Save the width and height
        obj.width = obj.posx2 - obj.posx1;
        obj.height = this.svg.draw.chr.height;

        //Create the rectangle
        obj.rect = this.svg.build.rect(obj.width, obj.height).attr({x: obj.posx1, y: obj.posy});

        //Add the style
        obj.rect.addClass('karyo-region-bg').opacity(0);

        //Add the animation
        obj.rect.animate(time).opacity(opr);

        //Add the thwo lines
        obj.line1 = this.svg.build.polyline([[obj.posx1, obj.posy], [obj.posx1, obj.posy + obj.height]]);
        obj.line2 = this.svg.build.polyline([[obj.posx2, obj.posy], [obj.posx2, obj.posy + obj.height]]);

        //Add the style for the lines
        obj.line1.addClass('karyo-region').opacity(0);
        obj.line2.addClass('karyo-region').opacity(0);

        //Add the animation
        obj.line1.animate(time).opacity(opl);
        obj.line2.animate(time).opacity(opl);

        //Push
        this.svg.draw.region.regs.push(obj);
      }
    }
  }

  //Initialize the hover
  this.svg.draw.hover = null;

  //Initialize the label
  this.svg.draw.label = null;

  //Initialize the selected region
  this.svg.draw.select = null;

  //Initialize the select label
  this.svg.draw.selectlabel = null;

  //Check if user has selected a region
  if(this.select.on === true)
  {
    //Show in console
    console.log('Karyo: drawing selected region [' + this.select.start + ',' + this.select.end + ']');

    //Calling to the draw function
    this.SelectDraw(true);
  }

  //Change the location
  this.status = 'detail';

  //Show the table report
  this.TableCreate(this.svg.draw.chr.id);

  //Show in console
  console.log('Karyo: opening chromosome ' + this.svg.draw.chr.id);
};

//Karyo Change Regions opacity
Karyo.prototype.DrawChrDetailRegionsOp = function(op)
{
  //Opacity for the rectangle
  var opr = op;

  //Check the opacity for the rectangle
  if(op == 1.0)
  {
    //Seet the default value
    opr = this.regrect.opacity;
  }

  //Check
  if(typeof this.svg.draw.region !== 'undefined')
  {
    //Loop over all regions
    for(var i = 0; i < this.svg.draw.region.regs.length; i++)
    {
      //Change the rect opacity
      this.svg.draw.region.regs[i].rect.opacity(opr);

      //Change the line1 opacity
      this.svg.draw.region.regs[i].line1.opacity(op);

      //Change the line2 opacity
      this.svg.draw.region.regs[i].line2.opacity(op);
    }
  }
};

//Karyo get the real position
Karyo.prototype.DrawChrDetailRealPos = function(pos)
{
  //Calculate the position
  var real = ((pos - this.svg.draw.chr.posx)/this.svg.draw.chr.width)*this.svg.draw.chr.length;

  //Add the start and round
  real = Math.floor(real + this.svg.draw.chr.start);

  //Return
  return real;
};

//Karyo Hover
Karyo.prototype.DrawChrDetailHover = function(posx)
{
  //Save the posy
  var posy = this.svg.draw.chr.posy - 40;

  //Delete
  this.DrawChrDetailHoverDestroy();

  //Create new
  this.svg.draw.hover = {};

  //Create the rectangle
  this.svg.draw.hover.rect = this.svg.build.rect(80, 30).attr({x: posx - 40, y: posy});

  //Add the style
  this.svg.draw.hover.rect.addClass('karyo-hover').radius(5);

  //Add the triangle
  this.svg.draw.hover.tri = this.svg.build.polygon([[posx - 6, posy + 28],[posx, posy + 36],[posx + 6, posy + 28]]);

  //Set the style
  this.svg.draw.hover.tri.addClass('karyo-hover');

  //Get the real position
  var real = this.DrawChrDetailRealPos(posx);

  //Add the text
  this.svg.draw.hover.text = this.svg.build.text(real.toString());

  //Change the position
  this.svg.draw.hover.text.attr({x: posx, y: posy + 4});

  //Change style
  this.svg.draw.hover.text.font(this.style.hovertext);

  //Show the real position on the foot
  this.FootPosition(real);
};

// Karyo Hover destroy
Karyo.prototype.DrawChrDetailHoverDestroy = function()
{
  //Check if exists
  if(this.svg.draw.hover)
  {
    //Remove the rectangle
    this.svg.draw.hover.rect.remove();

    //Remove the triangle
    this.svg.draw.hover.tri.remove();

    //Remove the text
    this.svg.draw.hover.text.remove();

    //Set as null
    this.svg.draw.hover = null;
  }
};

//Karyo Hover region
Karyo.prototype.DrawChrDetailLabel = function(n)
{
  //Check hover
  if(this.svg.draw.label === null)
  {
    //Check if label parser function is created
    var por = (this.reglabel.parser)? 2 : 1;

    //Create
    this.svg.draw.label = {};

    //Save the region num
    this.svg.draw.label.num = n;

    //Set the position
    var posx = Math.floor(this.svg.draw.region.regs[n].posx1 + this.svg.draw.region.regs[n].width/2);
    var posy = this.svg.draw.region.regs[n].posy + this.svg.draw.region.regs[n].height + 10;


    //Create the rectangle
    this.svg.draw.label.rect = this.svg.build.rect(this.reglabel.width, this.reglabel.height*por);

    //Set the position
    this.svg.draw.label.rect.attr({x: posx - this.reglabel.width/2, y: posy});

    //Set the triangle style
    this.svg.draw.label.rect.addClass('karyo-label').radius(5);


    //Create the triangle
    this.svg.draw.label.tri = this.svg.build.polygon([[posx - 6, posy + 2],[posx, posy - 6],[posx + 6, posy + 2]]);

    //Set the triangle style
    this.svg.draw.label.tri.addClass('karyo-label');


    //Set the start and end positions
    this.svg.draw.label.start = this.region.el[this.svg.draw.region.index].regions[n].start;
    this.svg.draw.label.end = this.region.el[this.svg.draw.region.index].regions[n].end;

    //Create the text
    this.svg.draw.label.text1 = this.svg.build.text(this.svg.draw.label.start + '-' + this.svg.draw.label.end);

    //Move the text
    this.svg.draw.label.text1.attr({x: posx, y: posy + 1});

    //Change style
    this.svg.draw.label.text1.font(this.style.labeltext);

    //Initialize the second text
    this.svg.draw.label.text2 = null;

    //Check for the second
    if(this.reglabel.parser !== null)
    {
      //Get the region object
      var robj = this.GetRegionsByChr(this.svg.draw.chr.id)[this.svg.draw.label.num];

      //Get the text
      var txt = this.reglabel.parser(this.svg.draw.chr.id, robj);

      //Create the text
      this.svg.draw.label.text2 = this.svg.build.text(txt);

      //Move the text
      this.svg.draw.label.text2.attr({x: posx, y: posy + this.reglabel.height - 2});

      //Change the style
      this.svg.draw.label.text2.font(this.style.labeltext);
    }
  }
};

// Karyo Hover region destroy
Karyo.prototype.DrawChrDetailLabelDestroy = function()
{
  //Check if exists
  if(this.svg.draw.label)
  {
    //Remove the rectangle
    this.svg.draw.label.rect.remove();

    //Remove the triangle
    this.svg.draw.label.tri.remove();

    //Remove the first text
    this.svg.draw.label.text1.remove();

    //Check for second text
    if(this.svg.draw.label.text2 !== null)
    {
      //Remove the second text
      this.svg.draw.label.text2.remove();
    }

    //Set as null
    this.svg.draw.label = null;
  }
};

//Draw chromosomes list
Karyo.prototype.DrawChrList = function()
{
  //Restart the svg
  this.svg.build.clear();

  //Clear the svg elements
  this.svg.draw = {};

  //Start the chromosome var
  this.svg.draw.chr = {};

  //Get the number of chromosomes
  this.svg.draw.chr.num = this.specie.el.chr.length;

  //Split the svg width in (chr_num-1) segments
  this.svg.draw.chr.space = this.svg.width - this.svg.margin.left - this.svg.margin.right;
  this.svg.draw.chr.space = Math.floor(this.svg.draw.chr.space/(this.svg.draw.chr.num - 1));

  //Calculate the chromosome width
  //this.svg.draw.chr_width = 2*Math.floor(this.svg.draw.chr_space/8);
  this.svg.draw.chr.width = this.chrlist.width;

  //Calculates the chromosome height
  this.svg.draw.chr.height = this.svg.height - this.svg.margin.top - this.svg.margin.bottom;

  //Get the maxium value
  this.svg.draw.chr.max = KaryoMaxChrLength(this.specie.el.chr);

  //Chr containers
  this.svg.draw.chrs = [];

  //Centomere
  this.svg.draw.centromere = [];

  //Text containers
  this.svg.draw.text = [];

  //Label container
  this.svg.draw.label = null;

  /* Obsolete
  //Create the title background
  this.svg.draw.title = this.svg.rect(400, 40).attr({x: this.width/2 - 200, y: this.margin.top/2 - 20});

  //Add the style
  this.svg.draw.title.addClass('karyo-title').radius(5);

  //Draw the title text
  this.svg.draw.title_text = this.svg.text(this.specie.name + ' (' + this.specie.assembly + ')');

  //Change the style
  this.svg.draw.title_text.font({'family': 'OpenSans', 'size': '18px', 'anchor': 'middle', 'fill': '#ffffff'});

  //Move the text
  this.svg.draw.title_text.attr({ x: Math.floor(this.width/2), y: this.margin.top/2 - 17});

  */

  //Draw all
  for(var i = 0; i < this.svg.draw.chr.num; i++)
  {
    //Create the new object
    var obj = {};

    //Time
    var time = 200 + 50*i;

    //Save the ID
    obj.id = this.specie.el.chr[i].id;

    //Save the width
    obj.width = this.svg.draw.chr.width;

    //Save the height
    obj.height = this.specie.el.chr[i].length/this.svg.draw.chr.max;
    obj.height = Math.floor(this.svg.draw.chr.height*obj.height);

    //Creates the new rect
    obj.svg = this.svg.build.rect(obj.width, obj.height);

    //Calculate the position
    obj.posx = this.svg.margin.left + this.svg.draw.chr.space*i - this.svg.draw.chr.width/2;
    obj.posy = this.svg.height - this.svg.margin.bottom - obj.height;

    //Move
    obj.svg.attr({ x: obj.posx, y: obj.posy });

    //Set the radius
    obj.svg.radius(5);

    //Set the style
    obj.svg.addClass('karyo-chr').opacity(0.0);

    //Set the animation
    obj.svg.animate(time).opacity(1.0);

    //Initialize the preview
    obj.preview = [];

    //Check for preview the regions
    if(this.chrpreview.show === true && this.region)
    {
      //Add the regions
      for(var j = 0; j < this.chrpreview.data[i].length; j++)
      {
        //Save the region
        var reg = this.chrpreview.data[i][j];

        //Create the rectangle
        var robj = this.svg.build.rect(this.svg.draw.chr.width, reg[1] - reg[0]);

        //Move the rectangle
        robj.attr({x: obj.posx, y: obj.posy + reg[0]});

        //Add the style
        robj.addClass('karyo-region-bg').opacity(0);

        //Add the animation
        robj.animate(time).opacity(this.chrpreview.op);

        //Save the regions
        obj.preview.push(robj);
      }
    }

    //Push the object
    this.svg.draw.chrs.push(obj);

    //Creates the text
    obj = {};

    //Create the text
    obj.svg = this.svg.build.text(this.specie.el.chr[i].id);

    //Change style
    obj.svg.font(this.style.chrtext);

    //Set the position
    obj.posx = this.svg.draw.chrs[i].posx + this.svg.draw.chr.width/2;
    obj.posy = Math.floor(this.svg.height - this.svg.margin.bottom + 5);

    //Move the text
    obj.svg.attr({ x: obj.posx, y: obj.posy });

    //Push
    this.svg.draw.text.push(obj);

    //Create the centromere
    if(Array.isArray(this.specie.el.chr[i].centromere) === true)
    {
      //Create the new object
      obj = {};

      //Set the width
      obj.width = this.svg.draw.chr.width;

      //Set the height
      obj.height = this.specie.el.chr[i].centromere[1] - this.specie.el.chr[i].centromere[0];
      obj.height = Math.floor(this.svg.draw.chr.height*(obj.height/this.svg.draw.chr.max));

      //Set the position x
      obj.posx = this.svg.draw.chrs[i].posx;

      //Set the position y
      obj.posy = this.svg.draw.chr.height*(this.specie.el.chr[i].centromere[0]/this.svg.draw.chr.max);
      obj.posy = this.svg.draw.chrs[i].posy + Math.floor(obj.posy);

      //Draw the rectangle
      obj.rect = this.svg.build.rect(obj.width + 4, obj.height).attr({x: obj.posx - 2, y: obj.posy});

      //style
      obj.rect.addClass('karyo-centromere-bg');

      //Add the polygon
      var poly = [];
      poly.push([obj.posx, obj.posy]);
      poly.push([obj.posx + obj.width/2, obj.posy + obj.height/2]);
      poly.push([obj.posx, obj.posy + obj.height]);
      poly.push([obj.posx + obj.width, obj.posy + obj.height]);
      poly.push([obj.posx + obj.width/2, obj.posy + obj.height/2]);
      poly.push([obj.posx + obj.width, obj.posy]);

      //Create the polygon
      obj.poly = this.svg.build.polygon(poly);

      //Set the class
      obj.poly.addClass('karyo-centromere').opacity(0.0);

      //Set the animation
      obj.poly.animate(time).opacity(1.0);

      //Push
      this.svg.draw.centromere.push(obj);
    }
    else
    {
      //Insert a null object
      this.svg.draw.centromere.push({"poly": null});
    }
  }

  //Change the location
  this.status = 'list';

  //Destroy the table
  this.TableDestroy();
};

//Exit from chromosome list
Karyo.prototype.DrawChrListExit = function(n)
{
  //Save the state
  this.status = null;

  //Set the time
  var time = 500;

  //Animate all chromosomes
  for(var i = 0; i < this.svg.draw.chr.num; i++)
  {
    //Check
    if(i !== n)
    {
      //Add the animation for the chromosome
      this.svg.draw.chrs[i].svg.animate(time).opacity(0);

      //Add the animation for the text
      this.svg.draw.text[i].svg.animate(time).opacity(0);

      //Check if centromere is defined
      if(this.svg.draw.centromere[i].poly)
      {
        //Add the animation
        this.svg.draw.centromere[i].poly.animate(time).opacity(0);
      }

      //Delete all the preview regions
      for(var j = 0; j < this.svg.draw.chrs[i].preview.length; j++)
      {
        //Delete the regions
        this.svg.draw.chrs[i].preview[j].animate(time).opacity(0);
      }
    }
  }

  //Hide the hover
  this.DrawChrListLabelDestroy();

  //Timeout
  KaryoDrawChrListTimeOut(this, time + 200, n);
};

//Draw hover
Karyo.prototype.DrawChrListLabel = function(n)
{
  //Check if the label is null
  if(this.svg.draw.label === null && this.chrlabel.parser !== null)
  {
    //Restart
    this.svg.draw.label = {};

    //Create the new hover
    this.svg.draw.label.id = this.specie.el.chr[n].id;

    //Save the num
    this.svg.draw.label.num = n;

    //Save the position x
    var posx = this.svg.draw.chrs[n].posx + this.svg.draw.chr.width/2;

    //Save the position y
    var posy = this.svg.height - this.svg.margin.bottom + 35;

    //Draw the rectangle
    this.svg.draw.label.rect = this.svg.build.rect(this.chrlabel.width, this.chrlabel.height);

    //Move
    this.svg.draw.label.rect.attr({ x: posx - this.chrlabel.width/2, y: posy });

    //Set the radius
    this.svg.draw.label.rect.radius(5);

    //Set the style
    this.svg.draw.label.rect.addClass('karyo-hover');

    //Set the initial opacity
    this.svg.draw.label.rect.opacity(0.0);

    //Set the animation
    this.svg.draw.label.rect.animate(100).opacity(1.0);


    //Get the text
    var txt = this.chrlabel.parser(this.svg.draw.label.id);

    //Show the text
    this.svg.draw.label.text = this.svg.build.text(txt);

    //Change the font
    this.svg.draw.label.text.font(this.style.hovertext);

    //Move the text
    this.svg.draw.label.text.attr({x: posx, y: posy + 4});


    //Draw the triangle
    this.svg.draw.label.tri = this.svg.build.polygon([[posx - 6, posy + 2],[posx, posy - 6],[posx + 6, posy + 2]]);

    //Set the style
    this.svg.draw.label.tri.addClass('karyo-hover');

    //Set the initial opacity
    this.svg.draw.label.tri.opacity(0.0);

    //Set the animation
    this.svg.draw.label.tri.animate(100).opacity(1.0);
  }
};

//Draw Hover destroy
Karyo.prototype.DrawChrListLabelDestroy = function()
{
  //Check if is defined
  if(this.svg.draw.label)
  {
    //Remove the rectangle
    this.svg.draw.label.rect.remove();

    //Remove the triangle
    this.svg.draw.label.tri.remove();

    //Remove the text
    this.svg.draw.label.text.remove();

    //Destroy
    this.svg.draw.label = null;
  }
};

//Calculate the max
function KaryoMaxChrLength(chr)
{
  //Def max
  var chmax = chr[0].length;

  //Read all
  for(var i = 0; i < chr.length; i++)
  {
    //Check
    if(chmax < chr[i].length)
    {
      //Change
      chmax = chr[i].length;
    }
  }

  //Return
  return chmax;
}

//Function for timeout
function KaryoDrawChrListTimeOut(_main, _time, _n)
{
  //Set time out
  setTimeout(function(){ _main.DrawChrDetail(_n); }, _time);
}

//Check if system is ready for draw
Karyo.prototype.Draw = function()
{
  //Show loading
  this.LoadingShow();

  //Set core as busy
  this.core.busy = true;

  //Check if system is ready
  if(this.specie.el && this.svg.build)
  {
    //Check if the user is using a region
    if(this.region.use === false || (this.region.use === true && this.region.el))
    {
      //Check for make the preview
      if(this.chrpreview.show === true && this.chrpreview.data.length == 0 && this.region.el)
      {
        //Make the preview regions
        this.Preview();
      }

      //Destroy the select
      this.SelectDestroy();

      //Start draw
      this.DrawChrList();

      //Show the specie in the foot
      this.FootSpecie();

      //Delete the position
      this.FootPosition(null);

      //Hide loading
      this.LoadingHide();

      //Set core as no busy
      this.core.busy = false;
    }
  }
};

//Karyo Click handler
Karyo.prototype.MouseClick = function(x, y)
{
  //Check if location is defined
  if(this.status)
  {
    //Check location
    if(this.status === 'list')
    {
      //Call to the click list
      this.MouseClickList(x, y);
    }
    else if(this.status === 'detail')
    {
      //Call to the click detail
      this.MouseClickDetail(x, y);
    }
    else
    {
      //Show error
      console.log('Karyo: unknow location state "' + this.status + '"');
    }
  }
};

//Karyo mouse Click list
Karyo.prototype.MouseClickList = function(x, y)
{
  //Check the label function
  if(this.svg.draw.label)
  {
    //Open chromosome
    this.DrawChrListExit(this.svg.draw.label.num);
  }
};

//Karyo mouse Click detail
Karyo.prototype.MouseClickDetail = function(x, y)
{
  //Check the hover region
  if(this.svg.draw.label)
  {
    //Execute the callback
    this.CallbackRun(this.svg.draw.label.start, this.svg.draw.label.end);
  }
};

//Karyo mouse down
Karyo.prototype.MouseDown = function(x, y)
{
  //Check if location is defined
  if(this.status)
  {
    //Check location
    if(this.status === 'detail')
    {
      //Check if user is hover the chromosome
      if(this.chrdetail.hover === true)
      {
        //Get the real position
        var p = this.DrawChrDetailRealPos(x);

        //Set the new positions
        var p1 = p;
        var p2 = p;

        //Check select down
        if(this.select.on === true)
        {
          //Check if user has clicked on the rectangle
          if(this.svg.draw.select.posx1 < x && x < this.svg.draw.select.posx2)
          {
            //Activate the drag
            this.selectdrag.move = true;

            //Show cursor move
            this.Cursor('move');
          }

          //Check if iser has clicked near the left line
          else if( this.PosNear(x, this.svg.draw.select.posx1, this.select.margin))
          {
            //Save the position
            p2 = this.select.end;

            //Set cursor as resize
            this.Cursor('resize');
          }

          //Check if user has clicked near the right line
          else if( this.PosNear(x, this.svg.draw.select.posx2, this.select.margin))
          {
            //Save the position
            p1 = this.select.start;

            //Set cursor as resize
            this.Cursor('resize');
          }
        }

        //Check if user has clicked on the rectangle
        if(this.selectdrag.move === true)
        {
          //Save the clicked position
          this.selectdrag.click = p;

          //Save the start position
          this.selectdrag.posx1 = this.select.start;

          //Save the end position
          this.selectdrag.posx2 = this.select.end;
        }
        else
        {
          //Save the position
          this.select.start = p1;
          this.select.end = p2;

          //Save the last position
          this.select.last = p;

          //Save the last position x
          this.select.lastx = x;
        }

        //Set select down true
        this.select.down = true;

      }
    }
  }
};

// Karyo Move function event
Karyo.prototype.MouseMove = function(x, y)
{
  //Check if location is defined
  if(this.status)
  {
    //Check location
    if(this.status === 'list')
    {
      //Call the hover list
      this.MouseMoveList(x, y);
    }
    else if(this.status === 'detail')
    {
      //Call the hover detail
      this.MouseMoveDetail(x, y);
    }
    else
    {
      //Show error
      console.log('Karyo: unknow location state "' + this.status + '"');
    }
  }
};

//Karyo mouse hover list
Karyo.prototype.MouseMoveList = function(x, y)
{
  //For check
  var is_hover = false;

  //Find if user is hover a chromosome
  for(var i = 0; i < this.svg.draw.chr.num; i++)
  {
    //Get the chr
    var mchr = this.svg.draw.chrs[i];

    //Check
    if(this.UtilRegHover(x, y, mchr.posx, mchr.posy, mchr.width, mchr.height))
    {
      //Draw the Hover
      this.DrawChrListLabel(i);

      //Show the cursor hand
      this.Cursor('hand');

      //Change the var
      is_hover = true;

      //Break
      break;
    }
  }

  //Check is_hover
  if(is_hover === false)
  {
    //Reset the cursor
    this.CursorHide();

    //Hide the label
    this.DrawChrListLabelDestroy();
  }
};

//Karyo mouse hover detail
Karyo.prototype.MouseMoveDetail = function(x, y)
{
  //Set hover as false
  this.chrdetail.hover = false;

  //Save the chromosome positions
  var pos = {x: this.svg.draw.chr.posx, y: this.svg.draw.chr.posy};

  //Check
  if(this.UtilRegHover(x, y, pos.x, pos.y, this.svg.draw.chr.width, this.svg.draw.chr.height))
  {
    //Draw the hover
    this.DrawChrDetailHover(x);

    //Check if select down is true and select is enabled
    //if(this.select.down === true && (this.select.lastx - x) !== 0)
    if(this.select.down === true && this.select.enabled === true)
    {
      //Change the lastx
      //this.select.lastx = -100;

      //Check for move
      if(this.selectdrag.move === true)
      {
        //Set cursor as move
        this.Cursor('move');

        //Send to select drag
        this.SelectDrag(x);
      }
      else
      {
        //Set cursor as resize
        this.Cursor('resize');

        //Send to select move
        this.SelectMove(x);
      }
    }
    else
    {
      //For check
      var is_hover = false;

      //Check is near a region
      for(var i = 0; i < this.svg.draw.region.regs.length; i++)
      {
        //Get the region
        var reg = this.svg.draw.region.regs[i];

        //Check if x is between posx1 and posx2
        if( reg.posx1 - 2 <= x && x <= reg.posx2 + 2)
        {
          //Draw the hover
          this.DrawChrDetailLabel(i);

          //Set the cursor hand
          this.Cursor('hand');

          //Change var
          is_hover = true;

          //Break
          break;
        }
      }

      //Check for delete the hover region
      if(is_hover === false)
      {
        //Reset the cursor
        this.CursorHide();

        //Hide the label
        this.DrawChrDetailLabelDestroy();
      }

      //Check if select is active
      if(this.select.on === true)
      {
        //Get vars
        var near1 = this.PosNear(x, this.svg.draw.select.posx1, this.select.margin);
        var near2 = this.PosNear(x, this.svg.draw.select.posx2, this.select.margin);

        //Check if is near
        if(this.svg.draw.select.posx1 < x && x < this.svg.draw.select.posx2)
        {
          //Hide cursor
          this.CursorHide();

          //Show cursor move
          this.Cursor('move');
        }
        else if(near1 === true || near2 === true)
        {
          //Hide cursor
          this.CursorHide();

          //Show cursor resize
          this.Cursor('resize');
        }
      }

      //Chage the move to false
      this.select.move = false;

      //Change the drag move to false
      this.selectdrag.move = false;
    }

    //Set the hover as true
    this.chrdetail.hover = true;
  }
  else
  {
    //Delete the hover
    this.DrawChrDetailHoverDestroy();

    //Delete the hover region
    this.DrawChrDetailLabelDestroy();

    //Hide cursor
    this.CursorHide();
  }
};

//Karyo Click handler
Karyo.prototype.MouseUp = function(x, y)
{
  //Check if location is defined
  if(this.status)
  {
    //Check location
    if(this.status === 'list')
    {
      //Call to the click list
      this.MouseUpList(x, y);
    }
    else if(this.status === 'detail')
    {
      //Call to the click detail
      this.MouseUpDetail(x, y);
    }
  }
};

//Karyo mouse Click list
Karyo.prototype.MouseUpList = function(x, y)
{
  //Check the label function
  if(this.svg.draw.label)
  {
    //Open chromosome
    this.DrawChrListExit(this.svg.draw.label.num);
  }
};

//Karyo mouse Click detail
Karyo.prototype.MouseUpDetail = function(x, y)
{
  //Check if select is activate
  if(this.select.on === true && this.select.start !== this.select.end)
  {
    //Check if user has move
    if(this.select.move === true)
    {
      //Check if select is enabled
      if(this.select.enabled === true)
      {
        //Generate the callback
        this.SelectRunCallback();
      }

      //Set move as false
      this.select.move = false;
    }
    else
    {
      //Delete the region
      this.SelectDestroy();

      //Return the opacity as true
      //this.DrawChrDetailRegionsOp(1.0);
    }
  }
  else
  {
    //Check the hover region
    if(this.svg.draw.label)
    {
      //Execute the callback
      this.CallbackRun(this.svg.draw.label.start, this.svg.draw.label.end);
    }

    //Delete the region
    this.SelectDestroy();

    //Return the opacity as true
    //this.DrawChrDetailRegionsOp(1.0);
  }

  //Set select down false
  this.select.down = false;
};

//Mouse event
Karyo.prototype.Mouse = function()
{
  //Mouse event
  KaryoMouseEvnt(this);
};

//Karyo mouse function event
function KaryoMouseEvnt(_main)
{
  //Save the ID
  var _id = '#' + _main.svg.id;

  //Mouse up
  $(_id).mouseup(function(e){

    //Prevent
    e.preventDefault();

    //Get the div position
    var posX = $(this).offset().left
    var posY = $(this).offset().top;

    //Call the click handler
    _main.MouseUp(e.pageX - posX, e.pageY - posY);

  });

  //Mouse down
  $(_id).mousedown(function(e){

    //Prevent
    e.preventDefault();

    //Get the div position
    var posX = $(this).offset().left
    var posY = $(this).offset().top;

    //Call the click handler
    _main.MouseDown(e.pageX - posX, e.pageY - posY);

  });

  //Mouse move
  $(_id).mousemove(function(e){

    //Prevent
    e.preventDefault();

    //Get the div position
    var posX = $(this).offset().left
    var posY = $(this).offset().top;

    //Call the click handler
    _main.MouseMove(e.pageX - posX, e.pageY - posY);

  });
}

//Karyo Genome Maps plugin
Karyo.prototype.GenomeMaps = function(call)
{
  //Show in console
  console.log('Karyo: starting Genome-Maps plugin');

  //Create the plugin vars
  this.genomemaps = {};
  this.genomemaps.input = 'regionField'; //ID for the input
  this.genomemaps.btn = 'goButton'; //ID for the Go button
  this.genomemaps.listen = true; //For listen button clicks

  //Add the event
  KaryoGenomeMapsEvent(this, 0);

  //Add the callback for genome maps
  this.callback = this.GenomeMapsCallBack;
};

//Karyo Genome Maps get region
Karyo.prototype.GenomeMapsListen = function()
{
  //Get the value
  var regsel = $('#' + this.genomemaps.input).val();

  //Check
  if(this.genomemaps.listen === true)
  {
    //Show in console
    console.log('Karyo: selecting region fron Genome Maps "' + regsel + '"');

    //Send to the parse select
    this.SelectReg(regsel, false);
  }
  else
  {
    //Change to true
    this.genomemaps.listen = true;
  }
};

//Karyo Genome Maps callback
Karyo.prototype.GenomeMapsCallBack = function(chr, start, end)
{
  //Set listen to false
  this.genomemaps.listen = false;

  //Change the value of genome maps search input
  $('#' + this.genomemaps.input).val(chr + ':' + start + '-' + end);

  //Run
  $('#' + this.genomemaps.btn).click();
};

//Initialize the event
function KaryoGenomeMapsEvent(_main, exec)
{
  //Check if element exits
  if($('#' + _main.genomemaps.btn) && exec > 0)
  {
    //Initialize the action click event
    $('#' + _main.genomemaps.btn).click(function(){ _main.GenomeMapsListen(); });

    //Initialize the change event
    $('#' + _main.genomemaps.input).change(function(){ _main.GenomeMapsListen(); });
  }
  else
  {
    //Set time out
    setTimeout(function(){ KaryoGenomeMapsEvent(_main, 1); }, 2000);
  }
}

//Karyo plugins
Karyo.prototype.Plugins = function(name, callback)
{
  //Find the plugin
  if(name === 'genome-maps')
  {
    //Call to the genome maps parser
    this.GenomeMaps(callback);
  }
  else
  {
    //Sow error in console
    console.error('Karyo: "' + name + '" plugin not found');
  }
};

//Karyo Table options
Karyo.prototype.TableOpt = function(opt)
{
  //Check for table title
  //if(typeof opt.title !== 'undefined'){ this.tablebar.title = opt.title; }

  //Check for table cols parser
  if(typeof opt.parser !== 'undefined'){ this.tablecols.parser = opt.parser; }

  //Check for table cols names
  if(typeof opt.colsName !== 'undefined')
  {
    //Save the number of columns
    this.tablecols.num = opt.colsName.length;

    //Save the array
    this.tablecols.names = opt.colsName;
  }

  //Check for table cols width
  if(typeof opt.colsWidth !== 'undefined')
  {
    //Check the number
    if(opt.colsWidth.length != this.tablecols.num)
    {
      //Show Error
      console.error('Karyo: error in Table Options, number of width cols is not the same.');
    }
    else
    {
      //Save the array
      //this.tablecols.width = opt.colsWidth;
    }
  }

  //Check for cols align
  if(typeof opt.colsAlign !== 'undefined')
  {
    //Check the number
    if(opt.colsAlign.length != this.tablecols.num)
    {
      //Show Error
      console.error('Karyo: error in Table Options, number of align cols is not the same.');
    }
    else
    {
      //Save the array
      this.tablecols.align = opt.colsAlign;
    }
  }

  //Check for show open
  if(typeof opt.openShow !== 'undefined'){ this.tableopen.show = opt.openShow; }

  //Check for open text
  if(typeof opt.openText !== 'undefined'){ this.tableopen.text = opt.openText; }
};

//Karyo Table report builder
Karyo.prototype.TableBuild = function()
{
  //Initialize the show table
  var show = '';

  //Check for show the report table
  if(this.table.show === false)
  {
    //Hide the table report
    show = 'style="display: none;"';
  }

  //Initialize the table div
  var div = '<div id="' + this.table.id + '" class="' + this.table.class + '" ' + show + '>';

  //Create the bar
  //div = div + '<div id="' + this.tablebar.id + '" class="' + this.tablebar.class + '">';

  //Add the track title
  //div = div + '<span>' + this.tablebar.title + '</span>';

  //Close the bar div
  //div = div + '</div>';

  //Create the content div
  //div = div + '<div id="' + this.tablecont.id + '" class="' + this.tablecont.class + '"></div>';

  //Close the table div
  div = div + '</div>';

  //Return the new div
  return div;
};

//Karyo Table report show/hide
Karyo.prototype.TableShowHide = function()
{
  //Check the actual status
  if(this.table.active === true)
  {
    //Set active as false
    this.table.active = false;

    //Hide the table
    $('#' + this.table.id).css('display', 'none');
  }
  else
  {
    //Set active as true
    this.table.active = true;

    //Show the table
    $('#' + this.table.id).css('display', 'block');
  }
};

//Karyo table build the rows
Karyo.prototype.TableRowsMaker = function(c)
{
  //Check for header
  var sheader = false;

  //Check for the header
  if(typeof c === 'undefined')
  {
    //Set c as the header
    c = this.tablecols.names;

    //Change all to upper case
    for(var i = 0; i < c.length; i++)
    {
      c[i] = c[i].toUpperCase();
    }

    //Set show header as true
    sheader = true;
  }

  //For calculate the correct col width
  var ccorr = 0;

  //Check for show open
  if(this.tableopen.show === true)
  {
    //Correct width
    ccorr = this.tableopen.width/c.length;
  }

  //Initialize the div
  var d = '';

  //Default width
  var cwidth = 100/c.length;

  //Read all
  for(var i = 0; i < c.length; i++)
  {
    //Initialize the column style for this col
    var cstyle = 'width: calc(' + cwidth + '% - ' + ccorr + 'px);';

    /*/Check the col width
    if(this.tablecols.width.length == this.tablecols.num)
    {
      //Add the width style
      cstyle = 'width:' + this.tablecols.width[i] + ';';
    }
    */

    //Check the col align
    if(this.tablecols.align.length == this.tablecols.num)
    {
      //Add the text align
      cstyle = cstyle + 'text-align:' + this.tablecols.align[i] + ';';
    }

    //Initialize the col
    d = d + '<div class="' + this.tablecols.class + '" style="' + cstyle + '">';

    //Add the col content
    d = d + c[i];

    //Close the col
    d = d + '</div>';
  }

  //Chekc for add the open col
  if(this.tableopen.show === true)
  {
    //Initialize the col
    d = d + '<div class="' + this.tablecols.class + '" style="width:' + this.tableopen.width + 'px;">';

    //Add the col content
    if(sheader === false)
    {
      //Add the element
      d = d + '<div class="' + this.tableopen.class + '">' + this.tableopen.text + '</div>';
    }
    else
    {
      //Add a empty col
      d = d + '&nbsp;';
    }

    //Close the col
    d = d + '</div>';
  }

  //Return the div
  return d;
};

//Karyo Table build the table
Karyo.prototype.TableCreate = function(chr)
{
  //Create the new div
  var div = this.tableempty.text.toUpperCase();

  //For check if regions has added
  var regionsOk = false;

  //Check if regions is defined
  if(this.region)
  {
    //Get the ID for this chr
    var r = this.UtilFindID(this.region.el, chr);

    //Check if region exists
    if( r > -1)
    {
      //Set as true
      regionsOk = true;

      //Initialize the table
      div = ''; // '<div class="' + this.table.class + '">';

      //Add the header
      div = div + '<div class="' + this.tablerows.class + ' ' + this.table.head + '">';

      //Add the header content
      div = div + this.TableRowsMaker();

      //Close the header div
      div = div + '</div>';

      //Add the content class
      div = div + '<div class="' + this.table.content + '">';

      //Add the regions
      for(var i = 0; i < this.region.el[r].regions.length; i++)
      {
        //Save the region
        var re = this.region.el[r].regions[i];

        //Array with the default row
        var rinfo = [chr, re.start, re.end, '-'];

        //Check for custom table parser
        if(this.tablecols.parser !== null)
        {
          //Call the custom parser
          rinfo = this.tablecols.parser(chr, re);
        }
        else if(this.reglabel.parser !== null)
        {
          //Save the custom label
          rinfo[3] = this.reglabel.parser(chr, this.region.el[r].regions, i);
        }

        //Add the new row
        div = div + '<div class="' + this.tablerows.class + ' ' + this.tablerows.over + '" ';

        //Add the row ID
        div = div + 'id="rep' + i + '">';

        //Add the row content
        div = div + this.TableRowsMaker(rinfo);

        //Close the row
        div = div + '</div>';
      }

      //Close the table content
      div = div + '</div>';
    }
  }

  //Show the new table
  $('#' + this.table.id).html(div);

  //Add the empty class
  $('#' + this.table.id).addClass(this.tableempty.class);

  //Check for add the events
  if(regionsOk === true)
  {
    //Add the display class
    //$('#' + this.table.id).addClass(this.table.display);

    //Remove the empty class
    $('#' + this.table.id).removeClass(this.tableempty.class);

    //Add the regions events
    for(var i = 0; i < this.region.el[r].regions.length; i++)
    {
      //Add the event for over and click
      KaryoTableRowEvnt(this, i);
    }
  }
};

//Karyo Table row over event
Karyo.prototype.TableRowOver = function(r)
{
  //Destroy the last label
  this.DrawChrDetailLabelDestroy();

  //Create the new
  this.DrawChrDetailLabel(r);
};

//Karyo Table row click event
Karyo.prototype.TableRowClick = function(r)
{
  //Check the over region
  if(this.svg.draw.label)
  {
    //Execute the callback
    this.CallbackRun(this.svg.draw.label.start, this.svg.draw.label.end);
  }
};

//Karyo Table destroy
Karyo.prototype.TableDestroy = function()
{
  //Show the new table
  $('#' + this.table.id).html(this.table.select.toUpperCase());

  //Add the empty class
  $('#' + this.table.id).addClass(this.tableempty.class);

  //Remove the display class
  //$('#' + this.table.id).removeClass(this.table.display);
};

//Karyo table over event
function KaryoTableRowEvnt(_main, _i)
{
  //Add the over event
  $('#rep' + _i).on('mouseover', function(){ _main.TableRowOver(_i); });

  //Add the click event
  $('#rep' + _i).click(function(e){ _main.TableRowClick(_i); });
}

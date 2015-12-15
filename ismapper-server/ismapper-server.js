//Import dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//My dependencies
var db = require('dosql');
var Config = require('../ismapper-config.json');

//Create the new app
var app = express();

//Set port
app.set('port', Config.server.port);

//EJS engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Static files
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); //Favicon
app.use(express.static(path.join(__dirname, 'public')));

//Boddy parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Cookies and session
app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F2'));
app.use(session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C0'}));

//Initialize request client
db.Connect(Config.sql);

//Local vars
app.locals.site = {};
app.locals.site.title = ' · ' + Config.name; //Site title
app.locals.site.url = Config.server.host; //Site url
app.locals.site.vendor = Config.vendor.host; //Vendor files url


//Routes and path
app.use('/', require('./routes/index'));
app.use('/', require('./routes/upload'));
app.use('/', require('./routes/project'));
app.use('/', require('./routes/report'));
app.use('/', require('./routes/ws'));


//Other: error
app.all('*', function(req, res){ res.status(404).send(); });

//Production error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', { message: err.message,  error: err});
});

//Create server
http.createServer(app).listen(app.get('port'), function(){
	//Show confirmation message
	console.log('Server listening on port ' + app.get('port'));
});

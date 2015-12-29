//Import dependencies
var stattic = require('stattic');

//Import config
var Config = require('../ismapper-config.json');

//Set the folder with the static files
stattic.set('static', './public');

//Set the port
stattic.set('port', Config.vendor.port);

//Run the server
stattic.run();

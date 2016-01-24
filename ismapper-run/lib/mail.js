//Import dependencies
var emailjs = require('emailjs');

//Import config
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Function for send the email
function Mail(id, results, callback)
{
	//Link to the project
	var link = ISConfig.server.host + 'project/' + id;

	//Generate the message
	var msg = '';
	msg = msg + 'Hello,<br><br>';
	msg = msg + 'Your project <b>' + results.title + '</b> is now available. You can access it ';
	msg = msg + 'using the next link: <br>';
	msg = msg + '<a href="' + link + '">' + link + '</a><br><br>';
	msg = msg + 'Remember that you must save the previous link, because you need it to ';
	msg = msg + 'access again and visualize your uploaded data.<br><br>';
	msg = msg + 'Note that this project will be removed from our server in <b>60</b> days.<br><br>';
	msg = msg + 'Regards.<br><br>';

	//Server connect
	var serverSet = {};
	serverSet.user = ISConfig.email.user; //Email username
	serverSet.password = ISConfig.email.pass; //Email password
	serverSet.host = ISConfig.email.host; //Email host

	//Connect to server
	var server = emailjs.server.connect(serverSet);

	//Create the email options
	var email = {};
	email.text = 'Your project ' + results.title + ' is ready. Access it here: ' + link;
	email.from = ISConfig.email.mail;
	email.to = results.email;
	email.subject = 'ISMapper - Your project ' + results.title + ' is ready.';
	email.attachment = [{ data: msg, alternative: true }];

	//Send the message
	server.send(email, function(err, message){

		//Show confirmation
		//console.log(err || message);

		//Do the callback
		callback();

	});
}

//Exports to node
module.exports = Mail;

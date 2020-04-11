//Import dependencies
var emailjs = require('emailjs');

//Import config
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Function for send the email
function Mail(id, results, num, callback)
{
    return callback(); //Email is disabled
	//Check for send the mail
	if(results.email === 'null')
	{
		//Do the callback without send the email
		return callback();
	}

	//Link to the project
	var link = ISConfig.server.host + 'project/' + id;

	//Generate the message
	var msg = '';

	//Get the title
	var title = '';

	//Check for success message
	if(num > 0)
	{
		//Send success message
		msg = msg + 'Hello,<br><br>';
		msg = msg + 'Your project <b>' + results.title + '</b> is now available. You can access it ';
		msg = msg + 'using the next link: <br>';
		msg = msg + '<a href="' + link + '">' + link + '</a><br><br>';
		msg = msg + 'Remember that you must save the previous link, because you need it to ';
		msg = msg + 'access again and visualize your uploaded data.<br><br>';
		msg = msg + 'Note that this project will be removed from our server in <b>60</b> days.<br><br>';
		msg = msg + 'Regards.<br><br>';

		//Set the title
		title = 'VISMapper - Your project ' + results.title + ' is ready.';
	}
	else
	{
		//Send error message
		msg = msg + 'Hello,<br><br>';
		msg = msg + 'There was an error running your project <b>' + results.title + '</b> (the aligner returned 0 mapped reads).<br>';
		msg = msg + 'Please, check your data and run it again.<br>';
		msg = msg + 'Regards.<br><br>';

		//Set the title
		title = 'VISMapper - Error running ' + results.title + '';
	}

	//Server connect
	var serverSet = {};
	serverSet.user = ISConfig.email.user; //Email username
	serverSet.password = ISConfig.email.pass; //Email password
	serverSet.host = ISConfig.email.host; //Email host
	serverSet.port = ISConfig.email.port; //Email port

	//Connect to server
	var server = emailjs.server.connect(serverSet);

	//Create the email options
	var email = {};
	email.text = 'Your project ' + results.title + ' is ready. Access it here: ' + link;
	email.from = ISConfig.email.mail;
	email.to = results.email;
	email.subject = title;
	email.attachment = [{ data: msg, alternative: true }];

	//Send the message
	server.send(email, function(err, message){

		//Show confirmation
		console.log(err || message);

		//Do the callback
		callback();

	});
}

//Exports to node
module.exports = Mail;

//Import dependencies
var exec = require('child_process').exec;

//Import configs
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Function for run the command
function ProjectRun(id)
{
	var command = Config.command;

	//Replace the node bin location
	command = command.replace(/{node}/g, ISConfig.bin.node);

	//Replace the run script location
	command = command.replace(/{run}/g, ISConfig.run);

	//Replace the project ID
	command = command.replace(/{project}/g, id);

	//Show in console the command
	console.log(command);

	//Execute the command
	exec(command);
}

//Exports to node
module.exports = ProjectRun;
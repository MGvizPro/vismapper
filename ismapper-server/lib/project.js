//Import dependencies
var fs = require('fs');
var db = require('dosql');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var exec_sync = require('child_process').execSync;
var execFile = require("child_process").execFileSync;
var get_id = require('getid');
var rmr = require('rmr');
var path = require('path');

//Import configs
var Config = require('../config.json');
var ISConfig = require('../../ismapper-config.json');

//Import libs
var parse_fasta = require('./parse-fasta.js');
var zip = require('./zip.js');
var days = require('./utils/days.js');

//Project object
var project = {};

//Generate the project folder
project.folder = function (id) {
    return path.join(ISConfig.uploads, id + '/');
};

//Create a new project
project.create = function (file, opt, cb) {
    var id = get_id({"prefix": "ISM"});
    console.log("[DEBUG] Creating project '" + id + "'");
    //Extract the zip file
    return zip.extract(file, function (error, extracted_path) {
        if (error) {
            return cb(error, null);
        }
        console.log("[DEBUG] Extracted FASTA/FASTQ file at '" + extracted_path + "'");
        var project_path = project.folder(id);
        //Create the new project folder
        return mkdirp(project_path, function (error) {
            if (error) {
                return cb(error, null);
            }
            console.log("[DEBUG] Created project folder: '" + project_path + "'");
            //Change the directory permissions
            exec_sync('chmod a+w ' + project_path);
            var project_fastq = path.join(project_path, 'input.fastq');
            //Parse the fasta file
            return parse_fasta(extracted_path, project_fastq, function (error, num_reads) {
                if (error) {
                    console.log('Error parsing fasta file, remove project project...');
                    return project.remove(id, function () {
                        return cb(error, null);
                    });
                }
                console.log("[DEBUG] FASTQ file saved as '" + project_fastq + "'");
                var project_expire = days.Expiration(Config.time.expiration);
                //Assign project metadata
                opt = Object.assign(opt, {
                    "id": id,
                    "ready": 0,
                    "date": project_expire,
                    "seq_orig": num_reads,
                    "seq_mapp": 0,
                    "time": 0
                });
                console.log("[DEBUG] Creating project with the following options: ");
                console.log(opt);
                //Create the project on the database
                return db.Do({"in": "project", "do": "insert", "values": opt}, function (results) {
                    project.run(id);
                    return cb(null, id);
                });
            });
        });
    });
};

//Delete a project
project.remove = function (id, cb) {
    var projectPath = project.folder(id); //Project path
    return rmr(projectPath, {"parent": true}, function (error) {
        return cb(error);
    });
};

//Run the project
project.run = function (id) {
    //var log = path.join(project.folder(id), 'run.log');
    //var command = Config.command;
    //command = command.replace(/{node}/g, ISConfig.bin.node);
    //var runf = path.join(ISConfig.run.replace('ismapper-run.js', ''), 'ismapper-run.js');
    //command = command.replace(/{run}/g, runf);
    //command = command.replace(/{project}/g, id);
    //command = command.replace(/{log}/g, log);
    //console.log(command);
    //exec(command);
    let runFolder = ISConfig.run.replace("ismapper-run.js", "");
    let args = [
        ISConfig.bin.node,
        path.join(runFolder, "ismapper-run.js"),
        id
    ];
    console.log(`[DEBUG] Running command '${ISConfig.bin.tsp} ${args.join(" ")}'`);
    let output = execFile(ISConfig.bin.tsp, args, {
        "cwd": runFolder
        "encoding": "utf8"
    });
    console.log(output);
};

//Exports to node
module.exports = project;

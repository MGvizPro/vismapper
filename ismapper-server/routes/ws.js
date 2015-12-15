//Import express
var express = require('express');
var router = express.Router();

//Import functions
var SetJson = require('../lib/set-json.js');
var ShowJson = require('../lib/show-json.js');

//Sections
var GetRegions = require('../lib/ws/get-regions.js');
var GetReads = require('../lib/ws/get-reads.js');
var GetGenesByRegion = require('../lib/ws/get-genes-region.js');
var GetGenesByName = require('../lib/ws/get-genes-name.js');
var GetGenesByTumour = require('../lib/ws/get-genes-tumour.js');
var GetTumours = require('../lib/ws/get-tumours.js');
var FullTumours = require('../lib/ws/full-tumours.js');
var FullGenes = require('../lib/ws/full-genes.js');

//Index of ws
router.get('/ws', function(req, res, next){ res.redirect('/'); });

//Get all the regions list
router.get('/ws/regions/:project/:reads', SetJson, GetRegions, ShowJson);

//Get the reads for a region
router.get('/ws/reads/:project/:region', SetJson, GetReads, ShowJson);

//Get the cancer genes by region
router.get('/ws/cancer/genes/by/region/:region', SetJson, GetGenesByRegion, ShowJson);

//Get the cancer genes by name
router.get('/ws/cancer/genes/by/name/:name', SetJson, GetGenesByName, ShowJson);

//Get the oncogenes by tumour
router.get('/ws/cancer/genes/by/tumour/:name', SetJson, GetGenesByTumour, ShowJson);

//Get the tumour by
router.get('/ws/cancer/tumours/:name', SetJson, GetTumours, ShowJson);

//Get the full onco genes
router.get('/ws/cancer/full/genes', SetJson, FullGenes, ShowJson);

//Get the full onco tumours
router.get('/ws/cancer/full/tumours', SetJson, FullTumours, ShowJson);

//Exports to node
module.exports = router;

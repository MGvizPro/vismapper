//Import express
var express = require('express');
var router = express.Router();

//Import libs
var resJson = require('../lib/utils/res-json.js');

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
router.get('/ws/regions/:project/:reads', resJson.Set, GetRegions, resJson.Show);

//Get the reads for a region
router.get('/ws/reads/:project/:region', resJson.Set, GetReads, resJson.Show);

//Get the cancer genes by region
router.get('/ws/cancer/genes/by/region/:region', resJson.Set, GetGenesByRegion, resJson.Show);

//Get the cancer genes by name
router.get('/ws/cancer/genes/by/name/:name', resJson.Set, GetGenesByName, resJson.Show);

//Get the oncogenes by tumour
router.get('/ws/cancer/genes/by/tumour/:name', resJson.Set, GetGenesByTumour, resJson.Show);

//Get the tumour by
router.get('/ws/cancer/tumours/:name', resJson.Set, GetTumours, resJson.Show);

//Get the full onco genes
router.get('/ws/cancer/full/genes', resJson.Set, FullGenes, resJson.Show);

//Get the full onco tumours
router.get('/ws/cancer/full/tumours', resJson.Set, FullTumours, resJson.Show);

//Exports to node
module.exports = router;

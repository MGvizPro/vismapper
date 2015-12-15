var genomeViewer;
var CELLBASE_HOST = 'http://bioinfodev.hpc.cam.ac.uk/cellbase';
var region = new Region({chromosome: "13", start: 32889611, end: 32889611});

getSpecies(function(s) { AVAILABLE_SPECIES = s; run(); });

function getSpecies(callback) {
    CellBaseManager.get({
        host: CELLBASE_HOST,
        category: "meta",
        subCategory: "species",
        success: function(r) {
            var taxonomies = r.response[0].result[0];
            for (var taxonomy in taxonomies) {
                var newSpecies = [];
                for (var i = 0; i < taxonomies[taxonomy].length; i++) {
                    var species = taxonomies[taxonomy][i];
                    for (var j = 0; j < species.assemblies.length; j++) {
                        var s = Utils.clone(species)
                        s.assembly = species.assemblies[j];
                        delete s.assemblies;
                        newSpecies.push(s)
                    }
                }
                taxonomies[taxonomy] = newSpecies;
            }
            callback(taxonomies);
        }
    });
}

function run() {

    var species = AVAILABLE_SPECIES.vertebrates[0];

    genomeViewer = new GenomeViewer({
        cellBaseHost: CELLBASE_HOST,
        cellBaseVersion: 'v3',
        target: 'application',
        width: document.querySelector('#application').getBoundingClientRect().width,
        region: region,
        availableSpecies: AVAILABLE_SPECIES,
        species: species,
        sidePanel: false,
        autoRender: true,
        resizable: true,
//        quickSearchResultFn:quickSearchResultFn,
//        quickSearchDisplayKey:,
        karyotypePanelConfig: {
            collapsed: true,
            collapsible: true
        },
        chromosomePanelConfig: {
            collapsed: true,
            collapsible: true
        },
        drawKaryotypePanel:false,
        drawChromosomePanel:false,
        drawOverviewTrackListPanel:false,
        navigationBarConfig: {
            componentsConfig: {
                restoreDefaultRegionButton:false,
//                regionHistoryButton:false,
               speciesButton:false,
              chromosomesButton:false,
               karyotypeButton:false,
                chromosomeButton:false,
                regionButton:false,
//                zoomControl:false,
               windowSizeControl:false,
//                positionControl:false,
//                moveControl:false,
//                autoheightButton:false,
//                compactButton:false,
                searchControl:false
            }
        },
        handlers: {
            'region:change': function(e) {
                console.log(e)
            }
        }
//        chromosomeList:[]
//            trackListTitle: ''
//            drawNavigationBar = true;
//            drawKaryotypePanel: false,
//            drawChromosomePanel: false,
//            drawOverviewTrackListPanel: false

    });


    tracks = [];

    this.sequence = new FeatureTrack({
        title: 'Sequence',
        height: 25,
        visibleRegionSize: 200,

        renderer: new SequenceRenderer(),
        dataAdapter: new CellBaseAdapter({
            category: "genomic",
            subCategory: "region",
            resource: "sequence",
            params: {},
            species: genomeViewer.species,
            cacheConfig: {
                chunkSize: 100
            }
        })
    });
    tracks.push(this.sequence);

    var oncoTrack = new FeatureTrack({
        title: 'Cancer Genes',
        maxLabelRegionSize: 3000,
        height: 120,

        renderer: new FeatureRenderer({
            label: function(f){ return f.gene; },
            color: function(f){ return '#4CAF50'; },
            tooltipText: function(f){
              //Generate the text with the oncogene
              var txt = 'Gene: ' + f.gene + '<br>';
              txt = txt + 'Name: ' + f.name + '<br>';
              txt = txt + 'Start-End: ' + f.start + '-' + f.end + '<br>';
              txt = txt + 'Entrez: ' + f.entrez + '<br>';
              txt = txt + 'Synonyms: ' + f.synonyms;

              //Check for somatic
              if(f.tt_somatic !== '') { txt = txt + '<br>Tumour types (somatic): ' + f.tt_somatic; }

              //Check for germline
              if(f.tt_germline !== '') { txt = txt + '<br>Tumour types (germline): ' + f.tt_germline; }

              //Return
              return txt;
            },
            tooltipTitle: function(f){return 'Gene - ' + f.gene;},
            infoWidgetId: "id",
            height: 8,
            histogramColor: "orange"
        }),

        dataAdapter: new FeatureTemplateAdapter({
           uriTemplate: Params.db.genes.region,
           parse: function (response) {
               for (var i = 0; i < response.length; i++)
               {
                 var r = response[i];

                 for (var j = 0; j < r.length; j++)
                 {
                     var rr = r[j];
                     rr.chromosome = rr.chr;
                     rr.strand = "1";
                 }
               }
               return response;
           },
           cacheConfig: { chunkSize: Params.default.chunk}
        })
    });

    tracks.push(oncoTrack);

    var readsTrack = new FeatureTrack({
        title: 'Reads',
        maxLabelRegionSize: 3000,
        //visibleRegionSize:12000,
        height: 200,

        renderer: new FeatureRenderer({
            label: function(f) { return f.id; },
            color: function(f) { return '#FF1744'; },
            tooltipText: function(f){
              var txt = 'ID: ' + f.id + '<br>';
              txt = txt + 'Start-End: ' + f.start + '-' + f.end + '<br>';
              txt = txt + 'CIGAR: ' + f.cigar + '<br>';
              txt = txt + 'MapQ: ' + f.mapq + '<br>';
              return txt;},
            tooltipTitle: function(f){return 'Read - ' + f.id;},
            infoWidgetId: "id",
            height: 8,
            histogramColor: "orange"
        }),

        dataAdapter: new FeatureTemplateAdapter({
           uriTemplate: Params.reads,
           parse: function (response) {
               for (var i = 0; i < response.length; i++)
               {
                 var r = response[i];

                 for (var j = 0; j < r.length; j++)
                 {
                     var rr = r[j];
                     rr.id = rr.name;
                     rr.chromosome = rr.chr;
                     rr.strand = "1";
                 }
               }
               return response;
           },
           cacheConfig: { chunkSize: Params.default.chunk }
        })
    });


    tracks.push(readsTrack);

    genomeViewer.addTrack(tracks);

    genomeViewer.draw();

    //Event for region change on genome maps
    genomeViewer.on('region:change region:move', function(event){

      //Create the full region
      var r = event.region.chromosome + ':' + event.region.start + '-' + event.region.end;

      //Send to karyo
      k.GoTo(r, false);

    });

}

//barebones express webserver for P2
//module dependencies
var http = require('http');

/* File System */
var fs = require('fs');

/* PubMed Module */
var pubmed = require('./pubmed.js');

/* Start the app */
pubmed.search({
	search: 'parkinson',
	database: 'pubmed',
	retstart: 0,
	retmax: 1
});

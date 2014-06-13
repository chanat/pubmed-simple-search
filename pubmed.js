/*
	Author: Chanat Attopakorn
	License: MIT
*/

/* File System */
var fs = require('fs');
var http = require('http');
var request = require('request');
var parseString = require('xml2js').parseString;


var ENTREZ_BASED_URL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
var USE_HISTORY_SERVER = '&usehistory=y';
var DEFAULT_DATABASE = 'pubmed';
var RETSTART = 0;
var RETMAX = 100

var pubmed = {};


var search = function(params) {

    var json = {};
    json.search = params.search ? params.search : '';
    json.search = json.search.replace(/ /g, '+');

    json.database = params.database ? params.database : DEFAULT_DATABASE;
    json.retstart = params.retstart ? params.retstart : RETSTART;
    json.retmax = params.retmax ? params.retmax : RETMAX;

    var requestUrl = ENTREZ_BASED_URL 
    	+ 'esearch.fcgi?db=' + json.database 
    	+ '&term=' + json.search 
    	+ '&retstart=' + json.retstart 
    	+ '&retmax=' + json.retmax 
    	+ USE_HISTORY_SERVER;

    //Do search 	
    request(requestUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //Get query key, WebEnv
            //First we convert XML to json then grab the keys
			var xml = body;
			parseString(xml, function (err, result) {
				var QueryKey = result.eSearchResult.QueryKey[0];
			    var WebEnv = result.eSearchResult.WebEnv[0];

			    //Fetch data from history server
			    requestUrl = ENTREZ_BASED_URL 
			    	+ 'efetch.fcgi?db=' + json.database
			    	+ '&query_key=' + QueryKey
			    	+ '&WebEnv=' + WebEnv
			    	+ '&rettype=xml&retmode=xml';


    			console.log("Please wait a moment, pulling data from " + json.database + " can take a while...");
			    //console.log(requestUrl);
			    request(requestUrl, function(error, response, body) {
			        if (!error && response.statusCode == 200) {
			        	//Write to file
						fs.writeFile('./output.xml', body, function(err) {
						    if(err)	console.log(err);
						    else console.log('The file output.xml was saved!');
						}); 

			        }
				});
			});
        }
    })


}



exports.search = search;

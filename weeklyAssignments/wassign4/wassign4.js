// --------------------------------------------
// weekly assignmnet 5
//
// barbara compagnoni
// fall 2015
//
// before running run the following command in 
// terminal "npm install mongodb"
// --------------------------------------------

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var fs = require('fs'); //part of core modules doesn't need an installvar cheerio = require('cheerio'); // npm intall cheerio
var async = require('async'); // npm install async
var request = require('request'); // npm install request
var cheerio = require('cheerio'); // npm intall cheerio
 
// Connection URL 
var url = 'mongodb://localhost:27017/aameetings';

var meetingInfo = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/inclass4.txt')); // not this file old file

// test input
// console.log(meetingInfo);

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  
  // if there isn't a connection print error
  assert.equal(null, err);
  
  // log in console if you can connect to server
  console.log("Connected correctly to server");
  
  insertDocuments(db, function() {
    
  // close database connection
  db.close();
  });
});

// function to insert info into documents
var insertDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('aameetings_area2');
  // Insert some documents 
  collection.insert(
  meetingInfo, function(err, result) {
    assert.equal(err, null);
    assert.equal(meetingInfo.length, result.result.n);
    assert.equal(meetingInfo.length, result.ops.length);
    console.log("Inserted " + meetingInfo.length +" documents into the document collection");
    callback(result);
  });
}





 
  
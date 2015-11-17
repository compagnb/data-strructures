// --------------------------------------------
// weekly assignment 5
//
// barbara compagnoni
// fall 2015
//
// Query
//
// --------------------------------------------

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  

var dbName = 'aaMeetings';
var collName = 'aameetings_area2';

// Connection URL
var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

// Retrieve
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    collection.aggregate([{ $match : { meetingDay: "Tuesdays"}},{ $match: { $or: [ { meetingTimes: { $gt: 7, $lt: 90 } } ]).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log(docs);
        }
        db.close();
        
    });

}); //MongoClient.connect
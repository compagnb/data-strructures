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
  

var dbName = 'aatest';
var collName = 'aameetings_area2';

// Connection URL
var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

// Retrieve
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    collection.aggregate([
        
    //{ $match: { meetingDayNum: 2 } 
    
    { $match: { meetingDay: "Tuesdays" } },
    { $match: { $or: [ { meetingStartHr: { $gt: 0, $lt: 19 } } ]}},
    {$group: {_id : "$cleanedAddress",
        meetingName: {$push: "$meetingName"}, 
        locationName: {$push: "$locationName"},
        addressMoreInfo: {$push: "$addressMoreInfo"},
        zipcode: {$push: "$zipcode"},
        lat: {$push: "$latLong.lat"},
        long: {$push: "$latLong.long"},
        meetingType: {$push: "$meetingType"},
        specialInterest: {$push: "$SpecialInterest"},
        handiAccess: {$push: "$handiAccess"},
        specialInfo: {$push: "$specialInfo"},
        meetingDay: {$push: "$meetingDay"},
        meetingStartTime: {$push: "meetingStartTime"}
    } 
        
    }]).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log(docs);
        }
        db.close();
        
    });


}); //MongoClient.connect
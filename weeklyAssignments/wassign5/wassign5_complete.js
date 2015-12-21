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

// Get current day and time info, and create end day and time vars for pipeline
var currentDate = new Date();
var startDayNum = currentDate.getDay();
var currentTime = currentDate.getHours();
var endTime = 4;

//console.log(startDayNum);

var endDayNum = getEndDay(startDayNum);

function getEndDay(startDayNum){
    if (startDayNum < 7){
        return startDayNum+1;
    } else {
        return 0
    }
    //console.log(endDayNum);
}


// Connection URL
var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

// Retrieve
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    collection.aggregate([
        
    //{ $match: { meetingDayNum: 2 } 
    
    
    // { $match: { meetingDayNum: 1 } },
    // { $match: { $or: [ { meetingStartHr: { $gt: 19, $lt: 24 } } ]}},
    { $match: {
        
        $or: [{
        
            $and: [{ meetingDay: startDayNum },
            { meetingStartHr: { $gt: startTime, $lt: 24 } } 
            ]},
        
            { $and: [{ meetingDay: endDayNum },
            { meetingStartHr: { $gt: 0, $lt: endTime } } 
            ]}
    ]}},
    
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
        meetingStartTime: {$push: "$meetingStartTime"},
        meetingStartHr: {$push: "$meetingStartHr"},
        meetingStartMin: {$push: "$meetingStartMin"}
    } 
        
    }]).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log(docs);
        }
        db.close();
        
    });


}); //MongoClient.connect
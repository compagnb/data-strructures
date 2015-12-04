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
  

var dbName = 'aaFinal';
var collName = 'manhattan';

// Get current day and time info, and create end day and time vars for pipeline
var currentDate = new Date();
// get the day number 0 = Sunday, 7 = Saturday... same as coded in object imported into db
var startDayNum = currentDate.getDay();
// get hours in military time, same as in object imported into db
var currentTime = currentDate.getHours();
// end time set to 4AM per Aaron 
var endTime = 4;

// testing console.
//console.log(startDayNum);

// get the end day number
var endDayNum = getEndDay(startDayNum);

// function to change the number by adding one, unless its a 7 then reset to 0
function getEndDay(startDayNum){
    if (startDayNum < 7){
        return startDayNum+1;
    } else {
        return 0
    }
    // test console
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
    // match start day and start time thru midnight OR end day til end time    
    { $match: {
        
        $or: [{
        
            $and: [{ meetingDay: startDayNum },
            { meetingStartHr: { $gt: currentTime, $lt: 25 } } 
            ]},
        
            { $and: [{ meetingDay: endDayNum },
            { meetingStartHr: { $gt: -1, $lt: endTime } } 
            ]}
    ]}},
    
    // group results by address (maybe change to lat long)
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
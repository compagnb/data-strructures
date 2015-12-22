// barbara compagnoni
// --------------------------------------------
// Final AA API WIP
//
// barbara compagnoni
// fall 2015
//
// --------------------------------------------

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var express = require('express')
var app = express(), cors = require("cors");
var data = [];




    
var dbName = 'aaFinal';
var collName = 'manhattan';
app.use(cors());

app.get('/', function (req, res) {
    

// Get current day and time info, and create end day and time vars for pipeline
var currentDate = new Date();
// get the day number 0 = Sunday, 7 = Saturday... same as coded in object imported into db
var currentDay = currentDate.getDay();
// get hours in military time, same as in object imported into db
var currentTime = currentDate.getHours();
// end time set to 4AM per Aaron 
var endTime = 4;

// testing console.
//console.log(startDayNum);

// get the end day number
var endDayNum = getEndDay(currentDay);

// function to change the number by adding one, unless its a 7 then reset to 0
function getEndDay(currentDay){
    if (currentDay > 7){
        return currentDay+1;
    } else {
        return 0
    }
    // test console
    //console.log(endDayNum);
}
 

if(!process.env.IP) { process.env.IP = "127.0.0.1" }

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
        
            $and: [{ meetingDayNum: currentDay },
            { meetingStartHr: { $gte: currentTime, $lt: 25} } 
            ]},
        
            { $and: [{ meetingDayNum: endDayNum },
            { meetingStartHr: { $gt: -1, $lte: endTime } } 
            ]}
    ]}},
    // group results by address (maybe change to lat long)
    { $group : { _id : { 
        meetingName: "$meetingName", 
        locationName: "$locationName",
        meetingAddress: "$cleanedAddress",
        addressMoreInfo: "$addressMoreInfo",
        zipcode: "$zipcode",
        specialInfo: "$specialInfo",
        handiAccess: "$handiAccess",
        latLong: "$latLong"
        },
    
        meetingDayNum: { $push :"$meetingDayNum"},
        meetingStartTime: { $push : "$meetingStartTime"},
        // meetingStartHr: { $push : "$meetingStartHr"},
        // meetingStartMin: { $push : "$meetingStartMin"},
        meetingEndTime: { $push : "$meetingEndTime"},
        meetingType: { $push : "$meetingType"},
        specialInterest: { $push : "$SpecialInterest"}
        }},
        
    { $group : { _id : { latLong : "$_id.latLong" }, 
        meetingGroups: {$addToSet: { meetingGroup: "$_id", 
                                meetings : {
                                meetingDayNum : "$meetingDayNum",
                                startTimes : "$meetingStartTime",
                                // startTimeHours : "$meetingStartHr",
                                endTimes : "$meetingEndTime",
                                meetingTypes : "$meetingType",
                                specialInterest : "$specialInterest"
                                }
        } }
    } }
    
        
    ]).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            //console.log(docs);
            //console.log(JSON.stringify(docs));
            for (var i=0; i < docs.length; i++) {
                // res.send(JSON.stringify(docs[i], null, 4));
                data.push(JSON.stringify(docs[i], null, 4));
                console.log(JSON.stringify(docs[i], null, 4));
                console.log('');
            }
            // res.send(JSON.stringify(data));
            res.send(docs);
        }
        db.close();
        
    });

}); //MongoClient.connect
    
    // res.send(JSON.stringify(data));
//   res.send(data)
})
 
app.listen(8080)
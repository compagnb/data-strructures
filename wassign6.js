// --------------------------------------------
// weekly assignment 6
//
// barbara compagnoni
// fall 2015
//
// --------------------------------------------

var request = require('request'); // npm install request
var async = require('async'); // npm install async
var cheerio = require('cheerio'); // npm install cheerio

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert'); // npm mongodb

var fs = require("fs"); // no need to install it is a core module

// variables for mongodb
var url = 'mongodb://localhost:27017/aameetings';

// live link of aa page 
var aaPage = "http://www.nyintergroup.org/meetinglist/meetinglist.cfm?zone=02&borough=M"
// file link for testing
// var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');
// use cheerio to load the content
var $ = cheerio.load(aaPage);
// var $ = cheerio.load(fileContent);

// Enviornment Variables
var apiKey = process.env.GMAKEY;
// var apiKey ='AIzaSyA-CKC1h7HYmCnIminO6aSpD0yaAxNTXw4';


var addresses = [];
var cleanedAddresses = [];
var geocodedAddresses = [];
var locationNames = [];
var cleanedLocationNames = [];
var meetingNames = [];
var cleanedMeetingNames = [];
var meetingSpecs = [];
var meetingDays = [];
var meetingTimes = [];
var meetingTypes = [];
var handicapAccessible = [];
var cleanedHandicapAccessible = [];
var specialInfo = [];
var cleanedSpecialInfo = [];
var directions = [];
var cleanedDirections = [];



async.waterfall([

    // check if mongo db is running
    function(callback) {
        // Use connect method to connect to the Server 
        MongoClient.connect(url, function(err, db) {
            // if there is a connection error print error
            assert.equal(null, err);
            // if we do tell us we have
            console.log("Connected correctly to server");
            db.close();
            callback(null);
        });
    },
    // load aa page data from url variabl
    function readAAPage(callback, body) {
        request(aaPage, function (error, response, body) {
            if (error) {
                //if we cant tell us why
                console.log(error);
            }
            // 200 is the code that says everything is okay
            if (!error && response.statusCode == 200) {
                console.log("page retrieved")
            }
            callback(null, body);
        });
    }, 
    // parse aa meeting data and add geo-coding
    function parseData(body, callback) {
        getMeetingInfo(body);
   }
   ],
    function(err, res){
    // feed results to mongo db
        // MongoClient.connect(url, function(err, db) {
        //     // if there isn't a connection print error
        //     assert.equal(null, err);
        //     // log in console if you can connect to server
        //     console.log("Connected correctly to server");
            
        //     insertDocuments(db, function() {
    
        //     // close database connection
        //     db.close();
        //     });
        // });
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


// get meeting info
function getMeetingInfo(body){

   var $ = cheerio.load(body);

    $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
    
        // addresses as is
        addresses.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim()); 
        // console.log(addresses[i]);
   
        // cleaned addresses
        cleanedAddresses.push(fixAddresses(addresses[i]));
        // console.log(fixAddresses(addresses[i]) );
   
        // original location names
        locationNames.push( $(elem).find('h4').eq(0).text().trim()); 
        // console.log(locationNames[i]);
        
        // cleaned and none replaces all with no specific location listed
        cleanedLocationNames.push(bool(locationNames[i]));
        // onsole.log(bool(locationNames[i]))
        
        // original meeting names
        meetingNames.push( $(elem).find('b').eq(0).text().replace(/\s+/g,' ').trim()); 
        // console.log(meetingNames[i]);
   
        // cleaned and none replaces all with no specific meeting names listed
        cleanedMeetingNames.push(fixMeetingNames(meetingNames[i]));
        // console.log(fixMeetingNames(meetingNames[i]));
        // handicap accessible -- needs to be turned into a boolean

        // handicapped data as is
        handicapAccessible.push( $(elem).find('span').eq(0).text().trim()); 
        //   console.log(handicapAccessible[i]);
  
        // returns non if there are no handi able access
        cleanedHandicapAccessible.push(bool(handicapAccessible[i]));
        // console.log(bool(handicapAccessible[i]));
        
        // special info -- needs to be trimmed
        specialInfo.push( $(elem).find('.detailsBox').eq(0).text().trim()); 
   
        // returns non if there is no special info
        cleanedSpecialInfo.push(bool(specialInfo[i]));
        // console.log(bool(specialInfo[i]));
    });
    
}

// function to clean addresses
function fixAddresses(oldAddress){
    var newAddress = oldAddress.substring(0,oldAddress.indexOf(',')) + ' New York, NY';
    return newAddress;
}

function bool(value){
    if (value == ""){
        return "none";
    }else{
        return value;
    }
}
// function to clean meeting names
function fixMeetingNames(wholeName){
    // var firstHalf = wholeName.substring(0,wholeName.indexOf('-'));
    // return firstHalf;
    var middle = wholeName.indexOf('-');
    var firstHalf = wholeName.toUpperCase().substring(0, middle).replace(/A.A./g, "AA").trim();
    var secondHalf = wholeName.toUpperCase().substring(middle + 2).replace(/- |-/g, "").trim();
    var firstHalfClean = firstHalf.replace(/\s/g,'');
    var secondHalfClean = secondHalf.replace(/\s/g,'');
    
    var compare = firstHalfClean.localeCompare(secondHalfClean);
    
    // console.log("--------------")
    // console.log("1 string:" + firstHalfClean + " | length: " + firstHalfClean.length );
    // console.log("2 string:" + secondHalfClean + " | length: " + secondHalfClean.length);
    // console.log(middle);
    // console.log(compare);
    
    if ( middle < compare && compare >= 4 ){
        // console.log(">= 4" + wholeName.replace(/-/g, ' ').trim());
        return wholeName.replace(/-/g, ' ').trim();
    // this is for ones with (:II) after the name
    }else if (compare == middle - 3 || compare == 0 || secondHalfClean.length == 0 || firstHalfClean.indexOf("(:I") != -1){
        // console.log("First return" + firstHalf.replace(/-/g, ' ').trim());
        return firstHalf.replace(/-/g, ' ').trim();
    // this is for ones with (:II) after the name
    }else if (firstHalfClean == 0 || secondHalfClean.indexOf("(:I") != -1){
        // console.log("second has #" + secondHalf.replace(/-/g, ' ').trim());
        return secondHalf.replace(/-/g, ' ').trim();
    // this is for ones with more then (:II) after the name
    }else if (compare < 0) {
        // console.log( "< 0" + firstHalf + ": " + secondHalf.substring(compare));
        return  secondHalf.substring(compare);
    // this is for ones that match
    }
}
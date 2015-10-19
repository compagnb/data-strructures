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

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'); // npm mongodb

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


var meetingInfo = [];
var origAddresses = [];
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

var $;


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
            request(aaPage, function(error, response, body) {
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
    function(err, res) {
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
        meetingInfo,
        function(err, result) {
            assert.equal(err, null);
            assert.equal(meetingInfo.length, result.result.n);
            assert.equal(meetingInfo.length, result.ops.length);
            console.log("Inserted " + meetingInfo.length + " documents into the document collection");
            callback(result);
        });
}


// get meeting info
function getMeetingInfo(body) {

    // use cheerio to load the content
    $ = cheerio.load(body);
    
    // get info from tables
    $('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {

        var obj = new Object;

            obj.meetingName = getCleanedName(i); 
            obj.locationName = getCleanedLocationName(i);
            obj.origAddress = getOriginalAddress(i);
            obj.cleanedAddress = getCleanedAddress(i);
            // obj.geotaggedAddress = getGeoTaggedAddress(i);
            // obj.meetingDays = getMeetingDays(i);
            // obj.meetingTimes = getMeetingTimes(i);
            // obj.meetingTypes = getMeetingTypes(i);
            // obj.meetingSpecialInterest = getMeetingSI(i);
            obj.handiAccess = getAccessible(i);
            obj.specialInfo = getMeetingInfo(i); 
            // obj.directions = 
             meetingInfo.push(obj);

             console.log(obj);

        function getCleanedName(i){
            // meeting names
            meetingNames.push( $(elem).find('b').eq(0).text().replace(/\s+/g,' ').trim());
            cleanedMeetingNames.push(fixMeetingNames(meetingNames[i]));

            return cleanedMeetingNames[i];
        }   

        function getCleanedLocationName(i){
            // location names
            locationNames.push( $(elem).find('h4').eq(0).text().trim()); 
            cleanedLocationNames.push(bool(locationNames[i]));

            return cleanedLocationNames[i];
        }
        
        function getOriginalAddress(i){
            // addresses
            origAddresses.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
            
            return origAddresses[i];
        }
        
        function getCleanedAddress(i){
            // addresses
            cleanedAddresses.push(fixAddresses(origAddresses[i]));
            
            return cleanedAddresses[i];
        }
        
        function getGeoTaggedAddress(i){
            
        }
        
        function getLatLong(i){
            
        }
        
        function getMeetingDays(i){
            // days
            
        }
        
        function getMeetingTimes(i){
             // times
            
        }
        
        function getMeetingTypes(i){
            // meeting type
            
        }
        
        function getMeetingSI(i){
             // special interest
            
        }
       
       function getMeetingInfo(i){
            // special info/motto
            specialInfo.push( $(elem).find('.detailsBox').eq(0).text().trim());
            
            // return cleaned
            return bool(specialInfo[i]);
            
        }
              
        function getAccessible(i){
            // handi-able
            handicapAccessible.push( $(elem).find('span').eq(0).text().trim());
            cleanedHandicapAccessible.push();
            
            // return cleaned
            return bool(handicapAccessible[i]);
        }

    });
    
    // // calls for array and the function to go over 
    // async.eachSeries(cleanedHandicapAccessible, function(value, callback) {

    //     // make an api request using the addy pulled in and the api key
    //     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value) + '&key=' + apiKey;

    //     // for testing purposes
    //     // console.log (apiRequest);

    //     var thisMeeting = new Object;
    //     thisMeeting.address = value;

    //     request(apiRequest, function(error, resp, body) {
    //         if (error) {
    //             throw error;
    //         }

    //         if (JSON.parse(body).status == "ZERO_RESULTS") {
    //             console.log("ZERO RESULTS for" + value);
    //         }
    //         else {
    //             thisMeeting.meetingName = cleanedMeetingNames(value);
    //             thisMeeting.loctionName = cleanedLocationNames(value);
    //             thisMeeting.origAddress = origAddresses(value);
    //             thisMeeting.formattedAddress = fixAddresses(value);
    //             thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
    //             thisMeeting.specialInfo = cleanedSpecialInfo(value);
    //             thisMeeting.handicap = cleanedHandicapAccessible(value);
    
    //             meetingInfo.push(thisMeeting);
    //         }
    //     });
    //     setTimeout(callback, 300);
    // }, function() {
    //     fs.writeFile('/home/ubuntu/workspace/data/test.txt', JSON.stringify(meetingInfo), function(err) {
    //         if (err)
    //             return console.log('Error');
    //         console.log('Wrote ' + meetingInfo.length + ' entries to file ' + 'test.txt');

    //     });
    // });
}




    // function to clean addresses
    function fixAddresses(oldAddress) {
        var newAddress = oldAddress.substring(0, oldAddress.indexOf(',')) + ' New York, NY';
        return newAddress;
    }

    function bool(value) {
        if (value == "") {
            return "none";
        }
        else {
            return value;
        }
    }
    // function to clean meeting names
    function fixMeetingNames(wholeName) {
        // var firstHalf = wholeName.substring(0,wholeName.indexOf('-'));
        // return firstHalf;
        var middle = wholeName.indexOf('-');
        var firstHalf = wholeName.toUpperCase().substring(0, middle).replace(/A.A./g, "AA").trim();
        var secondHalf = wholeName.toUpperCase().substring(middle + 2).replace(/- |-/g, "").trim();
        var firstHalfClean = firstHalf.replace(/\s/g, '');
        var secondHalfClean = secondHalf.replace(/\s/g, '');

        var compare = firstHalfClean.localeCompare(secondHalfClean);

        // console.log("--------------")
        // console.log("1 string:" + firstHalfClean + " | length: " + firstHalfClean.length );
        // console.log("2 string:" + secondHalfClean + " | length: " + secondHalfClean.length);
        // console.log(middle);
        // console.log(compare);

        if (middle < compare && compare >= 4) {
            // console.log(">= 4" + wholeName.replace(/-/g, ' ').trim());
            return wholeName.replace(/-/g, ' ').trim();
            // this is for ones with (:II) after the name
        }
        else if (compare == middle - 3 || compare == 0 || secondHalfClean.length == 0 || firstHalfClean.indexOf("(:I") != -1) {
            // console.log("First return" + firstHalf.replace(/-/g, ' ').trim());
            return firstHalf.replace(/-/g, ' ').trim();
            // this is for ones with (:II) after the name
        }
        else if (firstHalfClean == 0 || secondHalfClean.indexOf("(:I") != -1) {
            // console.log("second has #" + secondHalf.replace(/-/g, ' ').trim());
            return secondHalf.replace(/-/g, ' ').trim();
            // this is for ones with more then (:II) after the name
        }
        else if (compare < 0) {
            // console.log( "< 0" + firstHalf + ": " + secondHalf.substring(compare));
            return secondHalf.substring(compare);
            // this is for ones that match
        }
    }

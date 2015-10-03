
var fs = require('fs'); //part of core modules doesn't need an installvar cheerio = require('cheerio'); // npm intall cheerio
var async = require('async'); // npm install async
var request = require('request'); // npm install request
var cheerio = require('cheerio'); // npm intall cheerio

// for google API
// SETTING ENVIRONMENT VARIABLES (in Linux): 
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grep NEW_VAR
var apiKey ='AIzaSyA-CKC1h7HYmCnIminO6aSpD0yaAxNTXw4';
// var apiKey = process.env.GMAKEY;


var meetingInfo = [];
var addys = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/origAddresses.txt')); // not this file old file


function fixAddresses(oldAddress){
    var newAddress = oldAddress.substring(0,oldAddress.indexOf(',')) + ' New York, NY';
    return newAddress;
}


// eachSeries in the async module iterates over an array and operates on each item in the array in series
// // calls for array and the function ot ogo over 
async.eachSeries(addys, function(value, callback) {
    
    // make an api request using the addy pulled in and the api key
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value) + '&key=' + apiKey;
    
    // for testing purposes
    // console.log (apiRequest);
    
    var thisMeeting = new Object;
    thisMeeting.address = value;
    
    request(apiRequest, function(err, resp, body) {
        if (err) {
            throw err;
        }
        
        if (JSON.parse(body).status == "ZERO_RESULTS") { 
            console.log("ZERO RESULTS for" + value);
        } else {
            thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
            thisMeeting.formattedAddress = fixAddresses(value);
            meetingInfo.push(thisMeeting);
        }
    });
    setTimeout(callback, 300);
}, function() {
     fs.writeFile('/home/ubuntu/workspace/data/inclass4.txt', JSON.stringify(meetingInfo), function (err) {
         if (err) 
         return console.log('Error');
         console.log('Wrote ' + meetingInfo.length + ' entries to file ' + 'inclass4.txt');
        
     });
});


    
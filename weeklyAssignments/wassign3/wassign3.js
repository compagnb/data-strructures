// --------------------------------------------
// weekly assignment 3
//
// barbara compagnoni
// fall 2015
//
// push data into arrays
// clean data to read in google maps api
// final output in an array with lat and long.
//
// --------------------------------------------

// // Part 1 Export Addresses in a TXT file
// var fs = require('fs'); // core module no install need
// var cheerio = require('cheerio'); // npm intall cheerio


// var meetings = []; // addresses pulled from last week
// var cleanMeetings = []; // clean addresses
// var fullAddress = []; // add New York NY
// var googleAddy = []; // address in google format

// // put contents of the file in a variable
// var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// // use cheerio to load the content
// var $ = cheerio.load(fileContent);

// // gather data from document and format it into google api
// $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
//     meetings.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim());

//     cleanMeetings.push(meetings[i].substring(0, meetings[i].indexOf(',')));
//     fullAddress[i] = cleanMeetings[i] + ', New York, NY';
//     googleAddy[i] = (fullAddress[i].split(' ').join('+'));

//     // for testing
//     // console.log(googleAddy[i]);
//     });

// fs.writeFileSync('/home/ubuntu/workspace/data/addresses.txt', JSON.stringify(googleAddy));


// Part 2 Clean and get Google Data
var fs = require('fs'); //part of core modules doesn't need an installvar cheerio = require('cheerio'); // npm intall cheerio
var async = require('async'); // npm install async
var request = require('request'); // npm install request

// for google API
// SETTING ENVIRONMENT VARIABLES (in Linux):
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grep NEW_VAR
var apiKey ='AIzaSyA-CKC1h7HYmCnIminO6aSpD0yaAxNTXw4';
// var apiKey = process.env.GMAKEY;

var meetingInfo = [];
var addys = JSON.parse(fs.readFileSync('/home/ubuntu/workspace/data/addresses.txt'));

// console.log (addys);


// eachSeries in the async module iterates over an array and operates on each item in the array in series
// // calls for array and the function ot ogo over
async.eachSeries(addys, function(value, callback) {

    // make an api request using the addy pulled in and the api key
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value + '&key=' + apiKey;

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
            meetingInfo.push(thisMeeting);
        }
    });
    setTimeout(callback, 300);
}, function() {
     fs.writeFile('/home/ubuntu/workspace/data/wassign3.txt', JSON.stringify(meetingInfo), function (err) {
         if (err)
         return console.log('Error');
         console.log('completed');

     });
});

// --------------------------------------------
// weekly assignment 5
//
// barbara compagnoni
// fall 2015
//
// --------------------------------------------

var request = require('request'); // npm install request
var async = require('async'); // npm install async
var cheerio = require('cheerio');
var fs = require('fs');

// SETTING ENVIRONMENT VARIABLES (in Linux): 
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grep NEW_VAR
var apiKey = process.env.GMAKEY;
// var apiKey ='AIzaSyA-CKC1h7HYmCnIminO6aSpD0yaAxNTXw4';


var addresses = [];
var cleanedAddresses = [];
var geocodedAddresses = [];
var locationNames = [];
var meetingNames = [];
var meetingDays = [];
var meetingTimes = [];
var meetingTypes = [];
var handicapAccessible = [];
var specialInfo = [];
var directions = [];

// put contents of the file in a variable
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);

// Addresses!!!
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   addresses.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim()); 
//   console.log(addresses[i]);
   
   // cleaned addresses
//   console.log(fixAddresses(addresses[i]) );
   
   // geocoded addresses
   
});


// location names -- already cleaned
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   locationNames.push( $(elem).find('h4').eq(0).text().trim()); 
//   console.log(locationNames[i]);
});

// meeting names -- need to clean dashes and appostrophes
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   meetingNames.push( $(elem).find('b').eq(0).text().replace(/\s+/g,' ').trim()); 
    // console.log(meetingNames[i]);
   
   //cleaned
//   console.log(fixMeetingNames(meetingNames[i]));
});

// days
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   meetingDays.push( $(elem).find('td').next('td').find('b').eq(0).html()); 
//   console.log(meetingDays[i]);
});


// times
$('table[cellpadding=5]').find('tbody').find('tr').next('td').each (function (i, elem){
   meetingTimes.push( $(elem).find('td').find('b').next('b').prev().eq(0).html()); 
//   console.log(meetingTimes[i]);
});

// meeting types

// handicap accessible -- needs to be turned into a boolean
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   handicapAccessible.push( $(elem).find('span').eq(0).text().trim()); 
//   console.log(handicapAccessible[i]);
  
  // returns non if there are no handi able access
//   console.log(bool(handicapAccessible[i]));
  
});

// special info -- needs to be trimmed
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   specialInfo.push( $(elem).find('.detailsBox').eq(0).text().trim()); 
   
   // returns non if there is no special info
//   console.log(bool(specialInfo[i]));
});


// directions -- get href link
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   directions.push( $(elem).find('.GetDirections').eq(0).html()); 
    
    // console.log(directions[i]);
});

// function to clean addresses
function fixAddresses(oldAddress){
    var newAddress = oldAddress.substring(0,oldAddress.indexOf(',')) + ' New York, NY';
    return newAddress;
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
    
    console.log("--------------")
    console.log("1 string:" + firstHalfClean + " | length: " + firstHalfClean.length );
    console.log("2 string:" + secondHalfClean + " | length: " + secondHalfClean.length);
    console.log(middle);
    console.log(compare);
    
    if ( middle < compare && compare >= 4 ){
        console.log(">= 4" + wholeName.replace(/-/g, ' ').trim());
        return wholeName.replace(/-/g, ' ').trim();
    // this is for ones with (:II) after the name
    }else if (compare == middle - 3 || compare == 0 || secondHalfClean.length == 0 || firstHalfClean.indexOf("(:I") != -1){
        console.log("First return" + firstHalf.replace(/-/g, ' ').trim());
        return firstHalf.replace(/-/g, ' ').trim();
    // this is for ones with (:II) after the name
    }else if (firstHalfClean == 0 || secondHalfClean.indexOf("(:I") != -1){
        console.log("second has #" + secondHalf.replace(/-/g, ' ').trim());
        return secondHalf.replace(/-/g, ' ').trim();
    // this is for ones with more then (:II) after the name
    }else if (compare < 0) {
        console.log( "< 0" + firstHalf + ": " + secondHalf.substring(compare));
        return  secondHalf.substring(compare);
    // this is for ones that match
    }
}

function bool(value){
    if (value == ""){
        return "none";
    }else{
        return value;
    }
}

// // eachSeries in the async module iterates over an array and operates on each item in the array in series
// async.eachSeries(addresses, function(value, callback) {
//     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value).split(' ').join('+') + '&key=' + apiKey;
//     var thisMeeting = new Object;
//     thisMeeting.address = fixAddresses(value);
//     thisMeeting.originalAddress = value;
//     request(apiRequest, function(err, resp, body) {
//         if (err) {throw err;}
//         if (JSON.parse(body).status != "ZERO_RESULTS") {
//             thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
//         }
//         else {console.log(apiRequest);}
//         meetingsData.push(thisMeeting);
//     });
//     setTimeout(callback, 2000);
// }, function() {
//     // fs.writeFileSync('/home/ubuntu/workspace/data/geocodedMeetingsArray.txt', JSON.stringify(meetingsData));
// });

// // fs.writeFileSync('/home/ubuntu/workspace/data/addresses.txt', meetings);
// fs.writeFileSync('/home/ubuntu/workspace/data/addresses.txt', JSON.stringify(meetings)); 

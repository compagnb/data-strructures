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
var meetingSpecs = [];
var meetingDays = [];
var meetingTimes = [];
var meetingTypes = [];
var handicapAccessible = [];
var specialInfo = [];
var directions = [];
var test = [];

// put contents of the file in a variable
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist04M.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);

// Addresses!!!
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   addresses.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim()); 
   
  var addyInfo = [];
  addyInfo[i] = addresses[i].substr(addresses[i].indexOf(',')+1, addresses[i].length).trim();
  addyInfo[i] = addyInfo[i].substr(0, addyInfo[i].indexOf(','));
  //console.log(addyInfo[i]);
   
   // cleaned addresses
//   console.log(fixAddresses(addresses[i]) );
   
   // geocoded addresses
   
});


// location names -- already cleaned
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   locationNames.push( $(elem).find('h4').eq(0).text().trim()); 
   
//   console.log(locationNames[i]);
   
   // cleaned and none replaces all with no specific location listed
//   console.log(bool(locationNames[i]))
});

// meeting names -- need to clean dashes and appostrophes
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
    
    meetingSpecs.push($(elem).find('td').eq(1).html().replace(/>\s*/g, ">").replace(/\s*</g, "<").split("<br><br>"));
  
   
   //meetingNames.push( $(elem).find('b').eq(0).text().replace(/\s+/g,' ').trim()); 
    console.log(meetingSpecs[i]);
 
   
   // cleaned
//   console.log(fixMeetingNames(meetingNames[i]));
});
var specialInterest;
   for (var j = 0; j < meetingSpecs.length - 1; j++) {
        var oneMeeting = meetingSpecs[j].toString().split("b>");
        for (var k = 4; k < oneMeeting.length; k++) {
                if (oneMeeting[k].substr(0, 7) === "Meeting") {
                    var meetingType = oneMeeting[k + 1].toString()
                    console.log("type :  " +meetingType);
                }
                if (oneMeeting[k].substr(0, 7) === "Special") {
                    specialInterest = oneMeeting[k + 1];
                    if (specialInterest != undefined){
                     specialInterest = myTrim(specialInterest);
                    }
                    console.log("special :  " +specialInterest);
                }
            }
    }
// for (var j = 0; j < meetingSpecs.length - 1; j++) {
//     var oneMeeting = meetingSpecs[j].toString().split("b>");
//     var meetingDay = oneMeeting[1].substr(0, oneMeeting[1].indexOf(' From'));
//     var startTime = oneMeeting[2].substr(0, oneMeeting[2].indexOf('<')).trim();
//     var endTime = oneMeeting[4].substr(0, oneMeeting[4].indexOf('<')).trim();
    
//     // console.log(startTime);
//     // console.log(cleanHrs(startTime));
//     // console.log(endTime);
//     // console.log(cleanHrs(endTime));
//     // console.log("-----------------");
// }
function myTrim(x) {
    return x.replace(/[,<]/gm,' ');
}


function cleanHrs(time) {

    // pull the AM or PM out of the time data
    var m = time.substr(time.length - 2, time.length);

    // separate the hrs and mins
    var hrMins = time.split(":");
    var hr = parseInt(hrMins[0]);
    
    console.log(hr);
    
    if (m == "AM" && hr == "12" ){
        return 0;
    }
    if (m == "AM" && hr < 12){
        return parseInt(hr);
    }
    if (m == "PM" && hr === 12){
        return 12;
    }
    if (m == "PM" && hr < 12) {
        hr = hr * 1;
        return hr += 12;
    }

}

function cleanMins(time) {
    var mins = time.substr(time.indexOf(':') + 1, time.indexOf(':') + 2).trim();
    
    return parseInt(mins);
    
    
}
// meeting specs

// $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
//     meetingSpecs.push($(elem).find('td').eq(1).text().trim());
    
//     for (var j in meetingSpecs) {
//         meetingSpecs[j] = meetingSpecs[j].toString().replace(/[\r\n|\n| \t]+/g, " ");
//         meetingSpecs[j] = meetingSpecs[j].split("           ");
//         for (var q in meetingSpecs[j]) {
//             meetingSpecs[j]= meetingSpecs[j][q].trim();
        
//             meetingDays = meetingSpecs[j][q].substr(0, meetingSpecs[j][q].indexOf(' From'));
//             meetingTimes = meetingSpecs[j][q].substr(meetingSpecs[j][q].indexOf(' to ') -8, 8);
//             var endTimes = [];
//             endTimes = meetingSpecs[j][q].substr(meetingSpecs[j][q].indexOf(' to ')+3, 9);
//             // meetingTypes = meetingSpecs[j][q].substr(meetingSpecs[j][q].indexOf('=')-3, meetingSpecs[j][q].indexOf('meeting'));
//             // meetingInterests =  meetingSpecs[j][q].substr(meetingSpecs[j][q].indexOf('Special Interest '), 9);
//         }
//     }
    
//     console.log(meetingDays);
// });


// $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
//   meetingSpecs.push( $(elem).find('td').eq(1).html().replace(/>\s*/g,">").replace(/\s*</g,"<").split("<br><br>"));

//     for (var j=0; j < meetingSpecs.length-1; j++) {
//          var oneMeetingTime = meetingSpecs[j].toString().split("b>");
//          var theDeets = new Object;
//          meetingDays[j] = oneMeetingTime[1].substr(0, oneMeetingTime[1].indexOf(' From'));
        
         
//         console.log(meetingDays[j]);
         
         
         
//     }
//     console.log("---------" + locationNames[i])

  
 
  
// });

//   $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){ 
//     meetingSpecs.push( $(elem).find('td').eq(1).text().trim());
//     meetingSpecs[i] = meetingSpecs[i].replace(/[ \t]+/g, " ");
//     meetingSpecs[i] = meetingSpecs[i].replace(/[\r\n|\n]/g, " ").split("           ");

//     var type = meetingSpecs[i].toString().match(/<b>Meeting Type</b>/gi);
//     var si = "<b>Special Interest</b>";
  
//   if (meetingSpecs[i].toString().match(type)){
//     meetingTypes.push(meetingSpecs[i].toString().replace(/.*<b>Meeting Type<\/b>([^<]*).*/, "$1"));
    
//   }
//   console.log(meetingTypes[i]);
//     });
  
//   $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
//   meetingSpecs.push( $(elem).find('td').eq(1).html().replace(/\s\s+/g, "").split("<br><br>"));
  
//   meetingTimes.push(meetingSpecs[i].toString().match(/\d{1,2}:\d{1,2} [aApP][mM]/g) );
  
  
//   });
//   console.log(meetingTimes);
  
//     $('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
//     // meetingSpecs.push( $(elem).find('td').eq(1).html().replace(/\s\s+/g, "").split("<br><br>"));

//     test.push(meetingSpecs[i].toString().replace(/^\s+|\s+$/gm,'').trim());
//     // meetingTimes.push(meetingSpecs[i].substring(meetingSpecs[i].indexOf("to")+8, test[i].indexOf("to")-8)));
    
//     meetingTypes.push(test[i].substring(test[i].indexOf("Meeting Type"), test[i].indexOf("meeting")));
    
//       meetingSpecs.push( $(elem).find('td').eq(1).html());
//     // console.log(meetingSpecs[1].toString().replace(/^\s+|\s+$/gm,'').trim());
//     // console.log("times: " + test[i].substring(test[i].indexOf("From"), test[i].indexOf("Meeting Type")));
//     console.log("meeting types: " + meetingTypes[i].replace("</b>", ""));
//     console.log("------------------" );
//   console.log(meetingSpecs[i]);
// //   console.log(meetingTimes[i]);
   
//   console.log("days: "  );
//   console.log("times: " );
//   console.log("Special Interest: " );
//   console.log("meeting type: " );
//  });


// // times
// $('table[cellpadding=5]').find('tbody').find('tr').next('td').each (function (i, elem){
//   meetingTimes.push( $(elem).find('td').eq(1).text()); 
//   meetingTimes[i].replace(/[ \t]+/g, " ");
// //   meetingTimes[i].replace(/[\r\n|\n]/g, " ");
   
// //   console.log(meetingTimes);
// });
// console.log(meetingTimes);

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
  //console.log(bool(specialInfo[i]));
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

function cleanDays(value){
    var val1 = value.replace("FromtoMeeting Type", "");
    var val2 = val1.replace("Special Interest", "");
    return val2;
    
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
function cleanSpecial(special) {
    //var test = special.trim();
    //test.substr(0, test.length-1);
    //var cleaned = special.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
    return special;
}
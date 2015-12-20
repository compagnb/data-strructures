// --------------------------------------------
// Final AA Pull WIP
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
var url = 'mongodb://localhost:27017/aaFinal';

// data for testing AA indiv pages
var zones = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
var bourough = "M";

// Enviornment Variables
// var apiKey = process.env.GMAKEY;
// var apiKey = 'AIzaSyA-CKC1h7HYmCnIminO6aSpD0yaAxNTXw4';
var apiKey = 'AIzaSyAD-flxneEK2Jy7q076XnslG7mi4DbZXJs';

// live link of aa page for each zone 
// var aaPage = "http://www.nyintergroup.org/meetinglist/meetinglist.cfm?zone=" + zones[2] + "&borough=" + bourough;

// live link of aa page for all manhattan
var aaPage = "http://www.nyintergroup.org/meetinglist/meetinglist.cfm?searchstr=&borough=M&zone=Zone&zipcode=Zip+Code&day=&StartTime=&EndTime=&meetingtype=&SpecialInterest=&Go=Go";

// file link for testing
// var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// use cheerio to load the file content for testing
// var $ = cheerio.load(fileContent);

var meetingInfo = [];
var origAddresses = [];
var geocodedAddresses = [];
var googleAddresses = [];
var zipcodes = [];
var addyMoreInfo = [];
var latLong = [];
var locationNames = [];
var meetingNames = [];
var meetingSpecs = [];
var meetingDays = [];
var meetingTimes = [];
var meetingTypes = [];
var handicapAccessible = [];
var specialInfo = [];
var directions = [];
var googleapis = [];

var uploaded = false;

var obj;

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
        function parseData(body, parseCallback) {
            // use cheerio to load the content
            $ = cheerio.load(body);

            // get info from tables
            $('table[cellpadding=5]').find('tbody').find('tr').each(function(i, elem) {

                meetingSpecs.push($(elem).find('td').eq(1).html().replace(/>\s*/g, ">").replace(/\s*</g, "<").split("<br><br>"));
                meetingNames.push($(elem).find('b').eq(0).text().replace(/\s+/g, ' ').trim());
                locationNames.push($(elem).find('h4').eq(0).text().trim());
                origAddresses.push($(elem).find('td').eq(0).html().split('<br>')[2].trim());
                addyMoreInfo.push(origAddresses[i].substr(origAddresses[i].indexOf(',') + 2, origAddresses[i].length).trim());
                specialInfo.push($(elem).find('.detailsBox').eq(0).text().trim());
                handicapAccessible.push($(elem).find('span').eq(0).text().trim());
                
            });
            var geolocation;
            var zipcode;
            async.eachSeries(origAddresses, function(value, callback) {

                var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + fixAddresses(value).split(' ').join('+') + '&key=' + apiKey;
                // console.log(fixAddresses(value));
                // console.log(apiRequest);

                request(apiRequest, function(err, resp, body) {
                    if (err) {
                        throw err;
                    }

                    if (JSON.parse(body).status == "ZERO_RESULTS") {
                        console.log("ZERO RESULTS for" + value);
                    }
                    else {
                        geolocation = JSON.parse(body).results[0].geometry.location;
                        //console.log(JSON.parse(body).results[0].geometry.location);
                        //return JSON.parse(body).results[0].geometry.location;
                        zipcode = extractFromAdress(JSON.parse(body).results[0].address_components, "postal_code");
                        zipcodes.push(zipcode);
                        googleapis.push(apiRequest);
                        latLong.push(geolocation);
                    }
                });
                setTimeout(callback, 300);
            }, function() {
                console.log("geo coords gathered")
                console.log('Wrote ' + latLong.length + ' entries to array latLong');
                parseCallback(null);
                //console.log(latLong);
                //gotAddys = 1;
                // 

                //for testing
                fs.writeFile('/home/ubuntu/workspace/data/test.txt', JSON.stringify(meetingInfo), function(err) {
                    if (err)
                        return console.log('Error');
                    console.log('Wrote ' + meetingInfo.length + ' entries to file ' + 'test.txt');

                });
            });

        },
    ],
    function(parseCallback, err, res) {
        createObj();
        //console.log(meetingInfo);
        mongoUpload();

    });


// get meeting info

function getMeetingInfo(body) {



}


function mongoUpload() {
    //feed results to mongo db
    MongoClient.connect(url, function(err, db) {
        // if there isn't a connection print error
        assert.equal(null, err);
        // log in console if you can connect to server
        console.log("Connected correctly to server");

        insertDocuments(db, function() {
            // close database connection
            db.close();
        });
    });
}

// function to insert info into documents
var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('manhattan');
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

function createObj() {
    for (var i = 0; i < latLong.length - 1; i++) {
        for (var j = 0; j < meetingSpecs[i].length - 1; j++) {

            obj = new Object;

            obj.meetingName = fixMeetingNames(meetingNames[i]);

            obj.locationName = bool(locationNames[i]);

            obj.origAddress = origAddresses[i];
            obj.cleanedAddress = fixAddresses(origAddresses[i]);
            obj.addressMoreInfo = bool(cleanMoreAddyInfo(addyMoreInfo[i]));
            obj.zipcode = bool(zipcodes[i]);
            obj.geoCodedAddress = fixAddresses(origAddresses[i]).split(' ').join('+');
            obj.googleapis = googleapis[i];
            obj.latLong = latLong[i];

            var meeting = meetingSpecs[i];
            //obj.meetingDeets = meetingSpecs[i];
            var oneMeeting = meeting[j].toString().split("b>");
            var meetingDay = oneMeeting[1].substr(0, oneMeeting[1].indexOf(' From'));
            var startTime = oneMeeting[2].substr(0, oneMeeting[2].indexOf('<')).trim();
            var endTime = oneMeeting[4].substr(0, oneMeeting[4].indexOf('<')).trim();

            obj.meetingDay = meetingDay;
            obj.meetingDayNum = cleanDays(meetingDay);
            obj.meetingStartTime = startTime;
            obj.meetingStartHr = cleanHrs(startTime);
            obj.meetingStartMin = cleanMins(startTime);
            obj.meetingEndTime = endTime;
            obj.meetingEndHr = cleanHrs(endTime);
            obj.meetingEndMin = cleanMins(endTime);
            for (var k = 4; k < oneMeeting.length; k++) {
                if (oneMeeting[k].substr(0, 7) === "Meeting") {
                    var meetingType = oneMeeting[k + 1].toString()
                    obj.meetingType = cleanType(meetingType);
                }
                if (oneMeeting[k].substr(0, 7) === "Special") {
                    var specialInterest = oneMeeting[k + 1];
                    obj.SpecialInterest = cleanSpecial(specialInterest);
                }
            }

            obj.handiAccess = bool(handicapAccessible[i]);
            obj.specialInfo = bool(specialInfo[i]);


            // obj.directions =
            meetingInfo.push(obj);
            console.log(obj);

        }

    }
}


// function to clean addresses
function fixAddresses(oldAddress) {
    // console.log(oldAddress);
    var oldAddress1 = ckOldAddy(oldAddress);
    var newAddress = oldAddress1.substring(0, oldAddress1.indexOf(',')) + ' New York, NY';
    // console.log(newAddress);
    return newAddress;
    // console.log(newAddress);
}

// if i have time go back and fix these
function ckOldAddy(oldAddress){
    if (oldAddress == "253 Center Street, 3rd Floor,"){
        return "253 Centre Street,";
    } else if (oldAddress == "83 Christopher Street (Red Door, Left of Church)"){
        return "83 Christopher Street";
    } else if ( oldAddress == "7 East 10th Strert"){
        return "7 East 10th Street,";
    } else if( oldAddress == "207 West 96th Street, Little Room Basement,"){
        return "207 West 96th Street,";
    } else if( oldAddress == "Central Park West &amp; 76th Street - basement gymnasium,"){
        return "160 Central Park West,";
    } else if (oldAddress == "4 West 76th Street. Meeting in the gym.,"){
        return "4 West 76th Street,";
    }else if(oldAddress == "25 East 15th- Conference Room H, "){
         return "25 East 15th Street,";
    } else if(oldAddress == "65 East 89th Street - Rectory,"){
         return "65 East 89th Street,";
    } else if( oldAddress == "173 East 3rd Street- basement,"){
        return "173 East 3rd Street,";
    } else if( oldAddress == "307 W. 26th St."){
        return "307 W. 26th Street";
    } else {
        return oldAddress;
    }
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
    
    if (wholeName == "FOGLIFTERS-FIFTH AVENUE - Foglifters-Fifth Avenue"){
        return "FOGLIFTERS-FIFTH AVENUE";
    }
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

function cleanDays(day) {
    if (day == "Sundays" || day == "s") {
        return 0;
    }
    else if (day == "Mondays") {
        return 1;
    }
    else if (day == "Tuesdays") {
        return 2;
    }
    else if (day == "Wednesdays") {
        return 3;
    }
    else if (day == "Thursdays") {
        return 4;
    }
    else if (day == "Fridays") {
        return 5;
    }
    else if (day == "Saturdays") {
        return 6;
    }
}

function cleanType(type) {
    // console.log(type);
    // var clean;
    if(type.indexOf("=") < 4){
     clean = type.substr(type.indexOf("=")+2, type.indexOf('meeting')-4);   
    }else{
     clean = type.substr(type.indexOf("=")+2, type.indexOf(' meeting')-5);  
    }
    
    if (clean == "Open Discussion m"){
        clean = "Open Discussion";
    }
    
    if (clean == "Big Book m"){
        clean = "Big Book"
    }
    
    // console.log(clean);
    return clean;
}

function cleanSpecial(special) {
    //special.substr(0, special.length-1);
    if (special != undefined){
        var cleaned = special.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
    }
    return cleaned;
}


function cleanHrs(time) {

    // pull the AM or PM out of the time data
    var m = time.substr(time.length - 2, time.length);

    // separate the hrs and mins
    var hrMins = time.split(":");
    var hr = parseInt(hrMins[0]);

    //console.log(hr);

    if (m == "AM" && hr == "12") {
        return 0;
    }
    if (m == "AM" && hr < 12) {
        return parseInt(hr);
    }
    if (m == "PM" && hr === 12) {
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

// if i have time go back and fix these
function cleanMoreAddyInfo(moreInfo) {
    // console.log(moreInfo);
    var cleaned = moreInfo.substr(0, moreInfo.indexOf(','));
    if (cleaned == "Left of Church)"){
        return "(Red Door, Left of Church)";
    }else if (cleaned =="1st floor event room."){
        return "1st floor event room";
    }else{
        return cleaned;
    }
}

function extractFromAdress(components, type) {
    for (var i = 0; i < components.length; i++)
        for (var j = 0; j < components[i].types.length; j++)
            if (components[i].types[j] == type) return components[i].long_name;
    return "";
}

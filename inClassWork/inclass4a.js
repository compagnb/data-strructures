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

// Part 1 Export Addresses in a TXT file
var fs = require('fs'); // core module no install need
var cheerio = require('cheerio'); // npm intall cheerio


var meetings = []; // addresses pulled from last week
var cleanMeetings = []; // clean addresses
var fullAddress = []; // add New York NY
var googleAddy = []; // address in google format

// put contents of the file in a variable
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);

// gather data from document and format it into google api
$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
    meetings.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim()); 
    
    // cleanMeetings.push(meetings[i].substring(0, meetings[i].indexOf(',')));
    // fullAddress[i] = cleanMeetings[i] + ', New York, NY';
    // googleAddy[i] = (fullAddress[i].split(' ').join('+'));
    
    // for testing
    // console.log(googleAddy[i]);
    });
    
fs.writeFileSync('/home/ubuntu/workspace/data/origAddresses.txt', JSON.stringify(meetings));
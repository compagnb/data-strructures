// --------------------------------------------
// week 3 inclass
//
// barbara compagnoni
// fall 2015
//
// before running run the following command in 
// terminal "npm install request" and 
// "npm install cheerio"
// --------------------------------------------

var fs = require('fs');
var cheerio = require('cheerio');

var meetings = [];
var cleanMeetings = [];
var fullAddress = [];

// put contents of the file in a variable
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);


$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   meetings.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim()); 
    cleanMeetings.push(meetings[i].substring(0, meetings[i].indexOf(',')));
   fullAddress[i] = cleanMeetings[i] + ', New York, NY';
//   console.log(fullAddress[i].split(' ').join('+'));


});
    console.log(meetings[27]);
    // fs.writeFileSync('/home/ubuntu/workspace/data/origAddress.txt', JSON.stringify(fullAddress));



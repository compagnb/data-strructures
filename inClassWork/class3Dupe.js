// --------------------------------------------
// weekly assignment 2 inclass solution
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

// put contents of the file in a variable
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);


$('table[cellpadding=5]').find('tbody').find('tr').each (function (i, elem){
   meetings.push( $(elem).find('td').eq(0).html().split('<br>')[2].trim()); 
//   console.log(meetings[i]);
});

// fs.writeFileSync('/home/ubuntu/workspace/data/addresses.txt', meetings);
fs.writeFileSync('/home/ubuntu/workspace/data/addresses.txt', JSON.stringify(meetings)); 
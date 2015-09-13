// --------------------------------------------
// weekly assignment 2
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

// put contents of the file in a variable
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);

// use cheerio to narrow down file to table with a cellpadding of 5
var table = $('table').attr('cellpadding', '5');

// empty array for results
var parsedResults = [];


// iterate through each row of the tables body
$(table).find('tbody tr td:first-child').each(function (i, elem){
    
    //Get the text from cheerio.
    var text = $(this).text();
    
    //if undefined, create the object inside of our array. 
    if(parsedResults[i] == undefined){
        parsedResults[i] = {};
    };
    
    //Update the salary property of our object with the text value.
    parsedResults[i].address = text.trim().replace(/^\s+|\s+$/gm,' ');
    
    
    console.log(parsedResults[i]);
});

// trims space
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,' ');
}

// // sort and find .each(function(i,elem){
//     var colData = $(elem).text();
//     var finalData = colData.sp('br');
//     console.log();
    
// 
// $('table').attr('cellpadding', '5').html()
// iterate through each h4
// $('h4').each(function(i,elem){
//     console.log($(elem).html());
// });
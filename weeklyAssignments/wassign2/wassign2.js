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

//other data variables
// var placeName = $("td").children("h4").text();
// var meetingName = $("td:first-child").children("b").text();
// var handicapped = $(table).find('span').text();

// iterate through each row of the tables body
$(table).find('tbody tr').each(function (i, elem){
    
    // select the first child of the table column that is an..
    // var placeName = $("td").children("h4").eq(i).text();
    // var meetingName = $("td:first-child").children("b").eq(i).text();
    // var handicapped = $(table).find('span').eq(i).text();
    
    // all content from first column
    // var FirstCol = $("td:first-child").children().text();

    var address = $("td:first-child").children().remove().end().text();

    
    var trimAdd = myTrim(address);
    
    console.log(trimAdd);
});

// trims space
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,' ');
}

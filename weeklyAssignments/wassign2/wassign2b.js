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

// get info from tables
$('table').each(function(i, elem) {
    //if the table has a cellpadding of 5
    if ($(elem).attr("cellpadding") == '5') {
        //find rows
        $(elem).find('tr').each(function(i, elem){
            // find the first column in the rows
            $(elem).find('td').eq(0).each(function(i, elem){
                //log all the html and split at the the <br>
                console.log($(elem).html().split('<br>')[2].trim());
                
            });
    });

}
});
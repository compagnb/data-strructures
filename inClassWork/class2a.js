// --------------------------------------------
// class exercise 2
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
var fileContent = fs.readFileSync('/home/ubuntu/workspace/data/syllabus.txt');

// use cheerio to load the content
var $ = cheerio.load(fileContent);

// iterate through each h4
$('h4').each(function(i,elem){
    // console.log($(elem).text());
    if($(elem).text() == "Read"){
        $(elem).next().find('li').each(function(i,elem){
            console.log($(elem).text());
        });
    }
})
// console.log();

//put in an object or an array
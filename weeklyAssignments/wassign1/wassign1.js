// --------------------------------------------
// weekly assignmnet 1
//
// barbara compagnoni
// fall 2015
//
// before running run the following command in 
// terminal "npm install request"
// --------------------------------------------

// attach required node modules - fs is a core and needs no install, request requires install
var request = require('request');
var fs = require('fs');

// requesting a connection to website 
// with a call back
request('http://www.nyintergroup.org/meetinglist/meetinglist.cfm?zone=02&borough=M', function (error, response, body) {
    // if there wasn't an error
    // 200 is the code that says everything is okay
  if (!error && response.statusCode == 200) {
    // write the findings into a txt file in the directory...
    fs.writeFileSync('/home/ubuntu/workspace/data/aameetinglist02M.txt', body);
  }
  // prints out 'request failed' in the console if there is an error
  else {console.error('request failed')}
})
var async = require('async');

var names = ["Alex", "Betsy", "Chris", "Diana"];

async.eachSeries(names, function(value, callback){
    console.log(value);
    setTimeout(callback, 2500);
})

function y(){
    console.log('WHY?????????????');
}

setTimeout(y, 5000)
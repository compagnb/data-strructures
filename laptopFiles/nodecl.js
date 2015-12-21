var pg = require('pg');
var socket = require('socket.io-client')('http://ec2-52-90-228-208.compute-1.amazonaws.com/');

// add connection string here
var conString = "postgres://aaron:kitty555@data-structures.c2g7qw1juwkg.us-east-1.rds.amazonaws.com:5432/postgres";

var five = require("johnny-five"), bumper, led, exitBumper; 

five.Board().on("ready", function() {

  bumper = new five.Button(7);
  exitBumper = new five.Button(8);
  led = new five.Led(13);

  bumper.on("hit", function() {

    led.on();
    socket.emit('buttonPress', { buttonStatus : 'has been pressed'});

    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      client.query("INSERT INTO buttondata VALUES ('hello, button from Node', DEFAULT);", function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result);
    });

  });

    }).on("release", function() {
      led.off();
    });

  exitBumper.on("hit", function() {
    process.exit();
  })
});
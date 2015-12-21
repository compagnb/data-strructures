var pg = require('pg');
var socket = require('socket.io-client')('ec2-52-24-72-240.us-west-2.compute.amazonaws.com');

// add connection string here
var conString = "postgres://barb:pgdvdataviz@pgdv-data-structures.cruj1d5neyqx.us-west-2.rds.amazonaws.com:5432/postgres";

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

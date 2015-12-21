var pg = require('pg');

// add connection string here
var conString = "postgres://barb:pgdvdataviz@pgdv-data-structures.cruj1d5neyqx.us-west-2.rds.amazonaws.com:5432/postgres";


var five = require("johnny-five"), bumper, led, exitBumper;

five.Board().on("ready", function() {

  irReciever= new five.Sensor("A0");
  irLed = new five.Led(12);
  bumper = new five.Button(7);
  led = new five.Led(13);
  exitBumper = new five.Button(8);

  bumper.on("hit", function() {

    led.on();

    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      client.query("INSERT INTO targetData VALUES ('Fired!', DEFAULT);", function(err, result) {
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
    //process.exit();
  })
});

var pg = require('pg');
var socket = require('socket.io-client')('http://localhost:8080/');

// add connection string here
var conString = "postgres://barb:pgdvdataviz@pgdv-data-structures.cruj1d5neyqx.us-west-2.rds.amazonaws.com:5432/postgres";


var five = require("johnny-five"), bumper, led, exitBumper;
var hit = false;

five.Board().on("ready", function() {

  // define each var
  irReciever= new five.Sensor("A0");
  irLed = new five.Led(9);
  bumper = new five.Button(7);
  exitBumper = new five.Button(8);
  led = new five.Led(13);

  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  irReciever.scale(0, 1).on("change", function() {
    console.log(this.value);
    if (this.value < 1){
      socket.emit('buttonPress', { buttonStatus : 'has been pressed'});
      pg.connect(conString, function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }

        client.query("INSERT INTO sensorTest VALUES ('1', DEFAULT);", function(err, result) {
         //call `done()` to release the client back to the pool
         done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result);
      });
    });
    led.on();
    console.log("hit");
    } else {
      socket.emit('buttonPress', { buttonStatus : 'has been pressed'});
      pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      client.query("INSERT INTO sensorTest VALUES ('0', DEFAULT);", function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return console.error('error running query', err);
        }
        console.log(result);
    });
  });
        // if not hit the turn off led
        led.off();
    }
  });

  bumper.on("hit", function() {
    irLed.pulse();
  }).on("release", function() {
    irLed.stop().off();
    });

  exitBumper.on("hit", function() {
    //process.exit();
  })
});

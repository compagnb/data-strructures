// Barbara Compagnoni
// Fall 2015
// Data Structures
// Weekly Assignment 7 - IR Sensor

// declare variables
var five = require("johnny-five"), irReciever, irLed, bumper, led;

five.Board().on("ready", function() {

    // define each var
    irReciever= new five.Sensor("A0");
    irLed = new five.Led(9);
    bumper = new five.Button(7);
    led = new five.Led(13);


  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  irReciever.scale(0, 1).on("change", function() {
    console.log(this.value);
    if (this.value == 0){
        // if the sensor reads the IR light console log HIT! and turn on the led
        console.log("HIT!!!");
        led.on();
    } else {
        // if not hit the turn off led
        led.off();
    }
  });

  console.log(irReciever);

  bumper.on("hit", function() {
    irLed.pulse();
    console.log( "Light On!" );

  }).on("release", function() {
    irLed.stop().off()
    console.log( "Light Off!" );

  });
});

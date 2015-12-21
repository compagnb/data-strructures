var five = require("johnny-five");
var bumper;
var irLed;
var pressed = false;
var irReciever;
// var irValue = 0;


five.Board().on("ready", function() {

    bumper = new five.Button(7);
    irLed = new five.Led(13);
    irReciever= new five.Sensor("A0");

  bumper.on("hit", function() {
    console.log("trigger pulled, irValue = " );
    //led.on();
    pressed = true;

  }).on("release", function() {
    console.log("trigger released");
    //led.off();
    x

  });

// Scale the sensor's data from 0-1023 to 0-10 and log changes
  irReciever.on("change", function() {
    // irValue = this.value;
    this.pinMode(9, five.Pin.INPUT);
  this.digitalRead(9, function(value) {
    console.log(value);
    if (this.value == 0){
        // if the sensor reads the IR light console log HIT! and turn on the led
        console.log("HIT!!!");
        //led.on();
    } else {
        // if not hit the turn off led
        //led.off();
    }
  });
  //console.log(irReciever);
});

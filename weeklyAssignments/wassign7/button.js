var five = require("johnny-five"), bumper, led;

five.Board().on("ready", function() {

  bumper = new five.Button(7);
  led = new five.Led(13);

  bumper.on("hit", function() {
    led.on();
    console.log( "Light On!" );

  }).on("release", function() {
    led.off();
    console.log( "Light Off!" );

  });
});

var five = require("johnny-five"),
    board = new five.Board();

board.on("ready", function() {
  var calibrating = true;
  // Create a new `reflectance` hardware instance.
  var eyes = new five.IR.Reflect.Array({
    emitter: 13,
    pins: ["A0", "A1", "A2"], // any number of pins
  });

   // calibrate for two seconds
  eyes.calibrateUntil(function() { return !calibrating; });
  setTimeout(function() { calibrating = false; }, 2000);

  eyes.enable();

  eyes.on('data', function() {
    console.log( "Raw Values: ", this.raw );
  });

  eyes.on('line', function() {
    console.log( "Line Position: ", this.line);
  });
});

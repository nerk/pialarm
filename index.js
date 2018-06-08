//
// Pull GPIO 11 to VCC via 47k resistor. Connect momentary button to GPIO 11 and GND.
//  

var Push = require( 'pushover-notifications' )
var gpio = require('rpi-gpio');
var _ = require('underscore');
 
gpio.setup(11, gpio.DIR_IN, gpio.EDGE_FALLING);


var p = new Push({
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  // httpOptions: {
  //   proxy: process.env['http_proxy'],
  //},
  // onerror: function(error) {},
  // update_sounds: true // update the list of sounds every day - will
  // prevent app from exiting.
})

var msg = {
  // These values correspond to the parameters detailed on https://pushover.net/api
  // 'message' is required. All other values are optional.
  message: 'Button pressed',	// required
  title: "Alarm",
  sound: 'persistent',
  device: 'devicename',
  priority: 2,
  retry: 60,
  expire: 3600
}


var changeCallback = _.debounce(function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);

    if (value === false) {
      p.send(msg, function( err, result) {
        if (err) {
          throw err;
        }

        console.log(result);
      })
    }
}, 1000);

gpio.on('change', changeCallback);


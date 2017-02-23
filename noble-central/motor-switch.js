// Connect to the LED service 0xFFF1 and use 
// the keyboard as buttons to turn the light on and off
var noble = require('noble');
var keypress = require('keypress');

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning(['FFF1']); // Motor Service
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function (peripheral) {
  if (peripheral.advertisement.localName === 'Bluetooth Motor') { // Connect only to 'Bluetooth Motor'
    console.log(peripheral);
    connectAndSetUp(peripheral);
  }
});

function connectAndSetUp(peripheral) {

  peripheral.connect(function (error) {

    var serviceUUIDs = ['FFF1'];
    var characteristicUUIDs = ['FFF3']; // switchCharacteristic

    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
  });

  // attach disconnect handler
  peripheral.on('disconnect', onDisconnect);
}

function onDisconnect() {
  console.log('Peripheral disconnected!');
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {

  if (error) {
    console.log('Error discovering services and characteristics ' + error);
    return;
  }

  var switchCharacteristic = characteristics[0];

  function sendData(byte) {
    var buffer = new Buffer(1);
    buffer[0] = byte;
    switchCharacteristic.write(buffer, false, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Wrote: ' + byte);
      }
    });
  }

  function on() {
    sendData(0xFF);
  }

  function off() {
    sendData(0x00);
  }

  // speed() maps 0-9 to 0-255 and sends data to motor peripheral
  function speed(speed) {
    data = parseInt(speed) * 28.30;
    sendData(data);
  }

  keypress(process.stdin);
  process.stdin.on('keypress', function (ch, key) {

    if (key && key.ctrl && key.name == 'c') {
      process.exit();
    }

    // number keys don't have names O_o
    if (parseInt(ch) >= 0 || parseInt(ch) <= 9) { // Send numbers 0-9 to speed
      speed(ch);
    } else if (key && key.name == 'w') {  // other keys have names
      on();
    } else if (key && key.name == 's') {
      off();
    } else {
      console.log("Undefind key pressed!")
    }

  });
  process.stdin.setRawMode(true);
  process.stdin.resume();

}


var bleno = require('bleno');
var util = require('util');
var switchStatus = 0;
var speedLevel = 0xFF;

var Characteristic = bleno.Characteristic;
var PrimaryService = bleno.PrimaryService;

var printStatus = function () {
  if (!switchStatus) {
    console.log('Motor is OFF');
  } else {
    console.log('Motor is ON. Speed is', speedLevel);
  }
};

var SwitchCharacteristic = function () {
  SwitchCharacteristic.super_.call(this, {
    uuid: 'FFF2',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Switch'
      })
    ]
  });
};
util.inherits(SwitchCharacteristic, Characteristic);

SwitchCharacteristic.prototype.onReadRequest = function (offset, callback) {
  console.log('read request');
  console.log('Motor is ' + (switchStatus === 0 ? 'OFF' : 'ON'));
  var data = new Buffer(1);
  data[0] = switchStatus;
  callback(this.RESULT_SUCCESS, data);
};

SwitchCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
  console.log('write request: ' + data.toString('hex'));
  if (data[0]) {  // anything other than 0
    switchStatus = 1;
    if (speedLevel === 0) {
      speedLevel = 0xFF; // TODO notification
    }
  } else {
    switchStatus = 0;
  }
  printStatus();
  callback(this.RESULT_SUCCESS);
};

var SpeedCharacteristic = function () {
  SpeedCharacteristic.super_.call(this, {
    uuid: 'FFF2',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Speed'
      })
    ]
  });
};
util.inherits(SpeedCharacteristic, Characteristic);

SpeedCharacteristic.prototype.onReadRequest = function (offset, callback) {
  console.log('Read request', this.uuid);
  console.log('Speed is ' + speedLevel);
  var data = new Buffer(1);
  data[0] = speedLevel;
  callback(this.RESULT_SUCCESS, data);
};

SpeedCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
  console.log('write request: ' + data.toString('hex'));
  speedLevel = data[0];
  if (switchStatus === 0 && speedLevel > 0) {
    switchStatus = 1; // TODO notification
  } else if (switchStatus === 1 && speedLevel === 0) {
    switchStatus = 0; // TODO notification
  }
  printStatus();
  callback(this.RESULT_SUCCESS);
};

var motorService = new PrimaryService({
  uuid: 'FFF1',
  characteristics: [
    new SwitchCharacteristic(),
    new SpeedCharacteristic()
  ]
});

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Motor', [motorService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([motorService]);
  }
});

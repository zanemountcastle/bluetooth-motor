var noble = require('noble');

function initialize() {
    this.showMainPage();
    this.bindEvents();
}

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning(['FFF1']);
    } else {
        noble.stopScanning();
        alert('Please enable Bluetooth');
    }
});

noble.on('discover', function(peripheral) {
    // List available Bluetooth Motors
    var listItem = document.createElement('li');
    listItem.innerHTML = peripheral.advertisement.localName;
    listItem.dataset.deviceId = peripheral.id;
    deviceList.appendChild(listItem);
});

function connectToSpecificDevice(e) {
    var deviceId = e.target.dataset.deviceId;

    // Hacky way to allow to connect, but it works :)
    noble.stopScanning();
    noble.startScanning(['FFF1']);

    noble.on('discover', function(peripheral) {
        if (peripheral.id === deviceId) {
            new Notification('Bluetooth Motor', {body: 'Connecting to ' + peripheral.advertisement.localName, silent: true });
            connectAndSetUp(peripheral);
            noble.stopScanning();
            showDetailPage();
            deviceList.innerHTML = ''; // empty the list so no repeat items
        }

    });
}

function connectAndSetUp(peripheral) {
    peripheral.connect(function(error) {

        var serviceUUIDs = ['FFF1'];
        var characteristicUUIDs = ['FFF2', 'FFF3']; // switch, speed

        peripheral.discoverSomeServicesAndCharacteristics(
            serviceUUIDs,
            characteristicUUIDs,
            onServicesAndCharacteristicsDiscovered);
    });

    // attach disconnect handler
    peripheral.on('disconnect', onDisconnect);
}

function onDisconnect() {
    new Notification('Bluetooth Motor', {body: 'Device disconnected!', silent: true });
    showMainPage();
}

function refresh() {
    deviceList.innerHTML = ''; // empty the list so no repeat items

    // Timeout makes refresh look more realistic
    setTimeout(function() {noble.startScanning(['FFF1'])}, 1000);
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {

    if (error) {
        console.log('Error discovering services and characteristics ' + error);
        return;
    }

    var switchCharacteristic = characteristics[0];
    var speedCharacteristic = characteristics[1];

    function sendData(byte) {
        var buffer = new Buffer(1);
        buffer[0] = byte;
        switchCharacteristic.write(buffer, false, function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("wrote " + byte);
            }
        });
    }

    function on() {
        sendData(0xFF);
    }

    function off() {
        sendData(0x00);
    }

    function setSpeed() {

        if (!speedCharacteristic) {
            return;
        }
        var buffer = new Buffer([speed.value]);

        speedCharacteristic.write(buffer, false, function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Set speed to ' + buffer[0]);
            }
        });
    }

    if (speedCharacteristic) {
        speedCharacteristic.on('data', function(data, isNotification) {
            speed.value = data.readUInt8(0);
        });
    }

    onButton.addEventListener('click', on, false);
    offButton.addEventListener('click', off, false);
    speed.addEventListener('change', setSpeed, false);

    if (speedCharacteristic) {
        speedCharacteristic.read();
    }

}

function bindEvents() {
    deviceList.addEventListener('click', connectToSpecificDevice, false);
    refreshButton.addEventListener('click', refresh, false)
}

function showMainPage() {
    mainPage.hidden = false;
    detailPage.hidden = true;
}

function showDetailPage() {
    mainPage.hidden = true;
    detailPage.hidden = false;
}

initialize();

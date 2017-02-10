# Bluetooth Motor

This project is a Bluetooth Low Energy controlled motor built using an Arduino 101. The purpose of this project is to control a fan using Bluetooth, but it can obviously be easily generalized to any motor-powered device. The circuitry is based on [this](https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors?view=all) tutorial by Adafruit.


## Bluetooth LE Service Definition

The Bluetooth LE service is defined as `motorService` with a on/off switch characteristic and a motor speed characteristic. More specifically, below is the service and characteristics definitions:

```
BLEService motorService = BLEService("FF10");

// switchCharacteristic controls motor's on/off state
BLECharCharacteristic switchCharacteristic =
  BLECharCharacteristic("FF11", BLERead | BLEWrite);
BLEDescriptor switchDescriptor = BLEDescriptor("2901", "Switch");

// speedCharacteristic controls the motor's speed
BLECharCharacteristic speedCharacteristic =
  BLECharCharacteristic("FF12", BLERead | BLEWrite);
BLEDescriptor speedDescriptor = BLEDescriptor("2901", "Speed");
```

## Schematic Diagram

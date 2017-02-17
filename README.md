# Bluetooth Motor

This project is a Bluetooth Low Energy controlled motor built using an Arduino 101. The purpose of this project is to control a fan using Bluetooth, but it can obviously be easily generalized to any motor-powered device. The circuitry is based on [this](https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors?view=all) tutorial by Adafruit.


## Bluetooth LE Service Definition

The Bluetooth LE service is defined as `motorService` (UUID: 0xFFF1) with a on/off switch characteristic and a motor speed characteristic. More specifically, below is the service and characteristics definitions:

| Characteristic | UUID    | Properties        | Comment      |
| -------------- | ------- | ----------------- | ------------ |
| Switch         | 0xFFF2  | BLERead, BLEWrite | 0x01 or 0x00 |
| Speed         | 0xFFF3  | BLERead, BLEWrite | 0x00 to 0xFF |

## Components
- Arduino 101
- Half-size Breadboard
- 6V DC Motor
- PN2222 Transistor
- 1N4001 Diode

## Fritzing Diagram and Photos of Hardware
<img src="https://cloud.githubusercontent.com/assets/9016615/23041551/3506985a-f463-11e6-918d-e84c53eec40d.png" width="500">
<img src="https://cloud.githubusercontent.com/assets/9016615/22814537/6ab50bb2-ef22-11e6-9fb6-5d339dc0393e.JPG" width="500">

## Phonegap Application and Video 
<img src="https://cloud.githubusercontent.com/assets/9016615/23051423/e7d84306-f496-11e6-8329-8649d9495c74.PNG" width="300">
<img src="https://cloud.githubusercontent.com/assets/9016615/23051424/e9efa9c2-f496-11e6-98bc-620164b5d630.PNG" width="300">

[Here](https://youtu.be/wcAuevRtikU) is a video demonstrating the application live with a (very) makeshift fan. :)

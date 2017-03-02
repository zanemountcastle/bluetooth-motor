# Bluetooth Motor

This project is a Bluetooth Low Energy controlled motor built using an Arduino 101. The purpose of this project is to control a fan using Bluetooth, but it can obviously be easily generalized to any motor-powered device. The circuitry is based on [this](https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors?view=all) tutorial by Adafruit.


## Bluetooth LE Service Definition

The Bluetooth LE service is defined as `motorService` (UUID: 0xFFF1) with a on/off switch characteristic and a motor speed characteristic. More specifically, below is the service and characteristics definitions:

| Characteristic | UUID    | Properties        | Comment      |
| -------------- | ------- | ----------------- | ------------ |
| Switch         | 0xFFF2  | BLERead, BLEWrite | 0x00 or 0xFF |
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

## PhoneGap Application

PhoneGap allows for a more user friendly way to control the Bluetooth Motor peripheral. The application allows the user to turn the motor on and off and control the speed. To run the Phonegap application, in terminal enter the following,

```
$ cd phonegap-application
$ phonegap serve
```
Next, in the PhoneGap application, enter the IP address displayed in the terminal. Be sure to have PhoneGap and NodeJS version 6.9.x installed.

<img src="https://cloud.githubusercontent.com/assets/9016615/23051423/e7d84306-f496-11e6-8329-8649d9495c74.PNG" width="300">
<img src="https://cloud.githubusercontent.com/assets/9016615/23051424/e9efa9c2-f496-11e6-98bc-620164b5d630.PNG" width="300">

[Here](https://youtu.be/wcAuevRtikU) is a video demonstrating the application live with a (very) makeshift fan. :)

## Noble Central NodeJS Application

Noble allows us to control a Bluetooth Motor peripheral using the terminal. To control the application, use keys `0-9` to control relative speed from fully off to fully on or `w` to turn on and `s` to turn off. 

To run the NodeJS application, 
```
$ cd noble-central
$ npm install
$ node motor.js
```
[Here](https://youtu.be/Z7i75wW5wWE) is a video of the NodeJS application interacting with the Bluetooth Motor peripheral.

## Bleno Peripheral NodeJS Application

Bleno allows the computer itself to act as a Bluetooth Motor peripheral. To run the NodeJS applicaiton,
```
$ cd bleno-peripheral
$ npm install
$ node motor.js
```
[Here](https://youtu.be/XQatSOo6-SU) is a video of the PhoneGap application interacting with the computer as it acts as a Bluetooth Motor peripheral.

## Electron Central

The Electron application is a desktop-based platform for controlling the motor. To run the application,

```
$ cd electron-central
$ npm install               # Using Node version 6.9.5
$ npm run electron-rebuild
$ npm start
```
[Here]() is a video of the Electron application working.

## Web Bluetooth

Using Google Chrome, this application allows the user to control the Bluetooth motor from an internet browser.
<img width="400" alt="screen shot 2017-03-02 at 2 26 21 pm" src="https://cloud.githubusercontent.com/assets/9016615/23523331/70c5b7b2-ff54-11e6-87f5-00da93600bfa.png">
<img width="400" alt="screen shot 2017-03-02 at 2 26 34 pm" src="https://cloud.githubusercontent.com/assets/9016615/23523329/70c3919e-ff54-11e6-8f54-8bd442641bc7.png">


```
$ cd web-bluetooth-central
$ python -m SimpleHTTPServer
# Navigate to localhost:8000 in Google Chrome
```
[Here]() is a video of the Web Bluetooth application working.


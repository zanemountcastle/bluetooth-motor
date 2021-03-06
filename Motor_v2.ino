#include <CurieBLE.h>
#define MOTOR_PIN 6

BLEPeripheral blePeripheral;
BLEService motorService = BLEService("FFF1");

// switchCharacteristic controls motor's on/off state
BLECharCharacteristic switchCharacteristic =
  BLECharCharacteristic("FFF2", BLERead | BLEWrite);
BLEDescriptor switchDescriptor = BLEDescriptor("2901", "Switch");

// speedCharacteristic controls the motor's speed
BLEUnsignedIntCharacteristic speedCharacteristic =
  BLEUnsignedIntCharacteristic("FFF3", BLERead | BLEWrite);
BLEDescriptor speedDescriptor = BLEDescriptor("2901", "Speed");

void setup() {
  Serial.begin(9600);

  pinMode(MOTOR_PIN, OUTPUT);

  blePeripheral.setLocalName("Zane's Bluetooth Motor");
  blePeripheral.setDeviceName("Zane's Bluetooth Motor");
  blePeripheral.setAdvertisedServiceUuid(motorService.uuid());

  blePeripheral.addAttribute(motorService);

  blePeripheral.addAttribute(switchCharacteristic);
  blePeripheral.addAttribute(switchDescriptor);

  blePeripheral.addAttribute(speedCharacteristic);
  blePeripheral.addAttribute(speedDescriptor);

  switchCharacteristic.setEventHandler(BLEWritten, switchCharacteristicWritten);
  speedCharacteristic.setEventHandler(BLEWritten, speedCharacteristicWritten);


  blePeripheral.begin();

  while (! Serial); // Busy wait until serial ready
  Serial.println(F("Bluetooth Motor Ready!\n"));
}

void loop() {
  blePeripheral.poll();
}

void switchCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  if (switchCharacteristic.value()) {
    Serial.println(F("Motor on!"));
    analogWrite(MOTOR_PIN, 0xFF);
  } else {
    Serial.println(F("Motor off!"));
    analogWrite(MOTOR_PIN, 0x00);
  }
}

void speedCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print(F("Motor set to: "));
  Serial.println(speedCharacteristic.value());

  analogWrite(MOTOR_PIN, speedCharacteristic.value());
}


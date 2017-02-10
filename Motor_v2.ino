#include <CurieBLE.h>
#define MOTOR_PIN 6

BLEPeripheral blePeripheral;
BLEService motorService = BLEService("FF10");

// switchCharacteristic controls motor's on/off state
BLECharCharacteristic switchCharacteristic = 
  BLECharCharacteristic("FF11", BLERead | BLEWrite);
BLEDescriptor switchDescriptor = BLEDescriptor("2901", "Switch");

// speedCharacteristic controls the motor's speed
BLECharCharacteristic speedCharacteristic = 
  BLECharCharacteristic("FF12", BLERead | BLEWrite);
BLEDescriptor speedDescriptor = BLEDescriptor("2901", "Speed");

void setup() {
  Serial.begin(9600);
  
  pinMode(MOTOR_PIN, OUTPUT);

  blePeripheral.setLocalName("Bluetooth Motor");
  blePeripheral.setDeviceName("Bluetooth Motor");
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
  Serial.print(F("Characteristic event, written: "));

  if (switchCharacteristic.value()) {
    Serial.println(F("Motor on!"));
    digitalWrite(MOTOR_PIN, HIGH);
  } else {
    Serial.println(F("Motor off!"));
    digitalWrite(MOTOR_PIN, LOW);
  }
}

void speedCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print(F("Motor set to: "));
  Serial.println(speedCharacteristic.value());

  analogWrite(MOTOR_PIN, speedCharacteristic.value());
}


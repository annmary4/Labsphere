// LabSphere Master Initial Dataset
const INITIAL_RACKS = [
  {
    "id": 1,
    "name": "Rack 1",
    "subtitle": "Microcontrollers, Sensors, Motors, Connectors & Passive Components",
    "shelvesCount": 6
  },
  {
    "id": 2,
    "name": "Rack 2",
    "subtitle": "Wireless Comms, Displays & Traffic Lights, Batteries & Power, Hardware",
    "shelvesCount": 6
  }
];

const INITIAL_BOXES = [
  {
    "id": "BOX A-001",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-001: Arduino R4 Minima"
  },
  {
    "id": "BOX A-002",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-002: Arduino Uno R3"
  },
  {
    "id": "BOX A-003",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-003: Arduino Nano & ESP32 Microcontrollers"
  },
  {
    "id": "BOX A-004",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-004: Teensy 4.1 Development Board"
  },
  {
    "id": "BOX A-005",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-005: Mega 2560 Pro (Embed)"
  },
  {
    "id": "BOX A-006",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-006: ESP8266 Wi-Fi Module"
  },
  {
    "id": "BOX A-007",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-007: ESP CAM Module with Camera"
  },
  {
    "id": "BOX A-008",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-008: Raspberry Pi Pico W"
  },
  {
    "id": "BOX A-009",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-009: Raspberry Pi Single Board Computer"
  },
  {
    "id": "BOX A-010",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-010: Nvidia Jetson Nano Developer Kit"
  },
  {
    "id": "BOX A-011",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-011: STM32 with ST-Link Programmer"
  },
  {
    "id": "BOX A-012",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-012: STM32 F4VE Core Board"
  },
  {
    "id": "BOX A-013",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-013: STM32F4DCCU6 Core Board"
  },
  {
    "id": "BOX A-014",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-014: CP2102 USB to UART Serial Converter"
  },
  {
    "id": "BOX B-001",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-001: Metal Touch & MPR121 Touch Sensors"
  },
  {
    "id": "BOX B-002",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-002: Ultrasonic Distance Sensor"
  },
  {
    "id": "BOX B-003",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-003: SW-18015P Vibration & Infrared (K) Sensors"
  },
  {
    "id": "BOX B-004",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-004: MQ Gas Sensors Box (MQ-2, MQ-3, MQ-7, MQ-135)"
  },
  {
    "id": "BOX B-005",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-005: Heart Rate Pulse & TTP223 Touch Sensors"
  },
  {
    "id": "BOX B-006",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-006: Temperature & Humidity Sensor"
  },
  {
    "id": "BOX B-007",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-007: Sound Sensor Module"
  },
  {
    "id": "BOX B-008",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-008: Force Sensing Resistor (FSR)"
  },
  {
    "id": "BOX B-009",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-009: Rain Drop Sensor Board"
  },
  {
    "id": "BOX B-010",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-010: Touch Sensor Module TTP 224 (4-Key)"
  },
  {
    "id": "BOX B-011",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-011: HC-SR501 PIR Motion Sensor Module"
  },
  {
    "id": "BOX B-012",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-012: Sound Sensor (Big Microphone Module)"
  },
  {
    "id": "BOX B-013",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-013: Soil Moisture Sensor Module"
  },
  {
    "id": "BOX B-014",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-014: LDR Light Dependent Resistor 5mm"
  },
  {
    "id": "BOX B-015",
    "rackId": 1,
    "shelfId": 2,
    "label": "BOX B-015: Flex Sensor & Color Sensor TCS3200"
  },
  {
    "id": "BOX C-001",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-001: Johnson DC Motor 60 RPM"
  },
  {
    "id": "BOX C-002",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-002: Johnson DC Motor 300 RPM 12V"
  },
  {
    "id": "BOX C-003",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-003: Johnson DC Motor 200 RPM 12V"
  },
  {
    "id": "BOX C-004",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-004: Johnson DC Motor 100 RPM 12V"
  },
  {
    "id": "BOX C-005",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-005: Johnson DC Motor 30 RPM 12V"
  },
  {
    "id": "BOX C-006",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-006: NEMA Stepper Motor"
  },
  {
    "id": "BOX C-007",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-007: Micro Servo SG90"
  },
  {
    "id": "BOX C-008",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-008: MG90S Micro Metal Gear Servo"
  },
  {
    "id": "BOX C-009",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-009: Servo MG995 High Torque Motor"
  },
  {
    "id": "BOX C-010",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-010: Tower Pro MG945 Metal Gear Servo Motor"
  },
  {
    "id": "BOX C-011",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-011: 12V High Quality DC Mini Submersible Water Pump"
  },
  {
    "id": "BOX C-012",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-012: L293 / L293D Motor Driver Shield Module"
  },
  {
    "id": "BOX C-013",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-013: L298N Dual H-Bridge Motor Driver Module"
  },
  {
    "id": "BOX C-014",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-014: BTS7960 43A High Power Motor Driver Module"
  },
  {
    "id": "BOX C-015",
    "rackId": 1,
    "shelfId": 3,
    "label": "BOX C-015: L-Shape Mounting Bracket for Johnson DC Motor"
  },
  {
    "id": "BOX D-001",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-001: Female 2.54mm 2P Dupont Housing"
  },
  {
    "id": "BOX D-002",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-002: Female 2.54mm Crimp Terminal Pins"
  },
  {
    "id": "BOX D-003",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-003: Male 2.54mm Crimp Terminal Pins"
  },
  {
    "id": "BOX D-004",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-004: JST VH Connectors & Crimp Set"
  },
  {
    "id": "BOX D-005",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-005: JST XH Connectors & Crimp Set"
  },
  {
    "id": "BOX D-006",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-006: Screw Terminal Block 5.08mm 2-Pin"
  },
  {
    "id": "BOX D-007",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-007: Terminal Block Connector 3-Pin"
  },
  {
    "id": "BOX D-008",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-008: Quick Wire Connector Clamp"
  },
  {
    "id": "BOX D-009",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-009: Male & Female Battery Connectors (XT60/T-Plug)"
  },
  {
    "id": "BOX D-010",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-010: Male & Female Bullet Connectors 3.5mm"
  },
  {
    "id": "BOX D-011",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-011: USB Female 3.0 Panel Mount Port"
  },
  {
    "id": "BOX D-012",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-012: Mini USB Type-B Port Connectors"
  },
  {
    "id": "BOX D-013",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-013: White Silicon Wire 20mm"
  },
  {
    "id": "BOX D-014",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-014: Heatshrink Sleeve 3.5m"
  },
  {
    "id": "BOX D-015",
    "rackId": 1,
    "shelfId": 4,
    "label": "BOX D-015: 100 Ohm Carbon Film Resistors 1/4W"
  },
  {
    "id": "BOX A-015",
    "rackId": 1,
    "shelfId": 1,
    "label": "BOX A-015: Storage Footprint"
  },
  {
    "id": "BOX E-003",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-003: LDR Light Dependent Resistor 5mm"
  },
  {
    "id": "BOX E-004",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-004: Quick Wire Connector Clamp"
  },
  {
    "id": "BOX E-005",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-005: 100 Ohm Carbon Film Resistors 1/4W"
  },
  {
    "id": "BOX E-002",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-002: E18-D8ON Photoelecric switch"
  },
  {
    "id": "BOX E-001",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-001: Micro Lithium Cell passive buzzer 5mm"
  },
  {
    "id": "BOX E-003",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-003: LDR Light Dependent Resistor 5mm"
  },
  {
    "id": "BOX E-004",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-004: Quick Wire Connector Clamp"
  },
  {
    "id": "BOX C-001",
    "rackId": 2,
    "shelfId": 3,
    "label": "BOX C-001: Male & Female Battery Connectors (XT60/T-Plug)"
  },
  {
    "id": "BOX E-005",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-005: 100 Ohm Carbon Film Resistors 1/4W"
  },
  {
    "id": "BOX C-002",
    "rackId": 2,
    "shelfId": 3,
    "label": "BOX C-002: 18650 Battery Holder Case 2-Slot"
  },
  {
    "id": "BOX D-002",
    "rackId": 2,
    "shelfId": 4,
    "label": "BOX D-002: Mini Rocker & Toggle Switch Pack"
  },
  {
    "id": "BOX A-005",
    "rackId": 2,
    "shelfId": 1,
    "label": "BOX A-005: IR Remote kit"
  },
  {
    "id": "BOX E-002",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-002: E18-D8ON Photoelecric switch"
  },
  {
    "id": "BOX D-001",
    "rackId": 2,
    "shelfId": 4,
    "label": "BOX D-001: Standoff and Black plastic corner protector"
  },
  {
    "id": "BOX C-004",
    "rackId": 2,
    "shelfId": 3,
    "label": "BOX C-004: XL4015 DC-DC Buck converter"
  },
  {
    "id": "BOX C-003",
    "rackId": 2,
    "shelfId": 3,
    "label": "BOX C-003: Lithium Battery level indicator"
  },
  {
    "id": "BOX E-001",
    "rackId": 2,
    "shelfId": 5,
    "label": "BOX E-001: Micro Lithium Cell passive buzzer 5mm"
  },
  {
    "id": "BOX B-004",
    "rackId": 2,
    "shelfId": 2,
    "label": "BOX B-004: 4 digit 7-segment display module"
  },
  {
    "id": "BOX B-002",
    "rackId": 2,
    "shelfId": 2,
    "label": "BOX B-002: LCD 2004 parallel display"
  },
  {
    "id": "BOX B-003",
    "rackId": 2,
    "shelfId": 2,
    "label": "BOX B-003: 8*8 LED DOT Matrix module"
  },
  {
    "id": "BOX B-001",
    "rackId": 2,
    "shelfId": 2,
    "label": "BOX B-001: 16*02 LCD Display"
  },
  {
    "id": "BOX B-006",
    "rackId": 2,
    "shelfId": 2,
    "label": "BOX B-006: Traffic light with DHT 11 and ESP 32"
  },
  {
    "id": "BOX B-005",
    "rackId": 2,
    "shelfId": 2,
    "label": "BOX B-005: Traffic light"
  },
  {
    "id": "BOX A-004",
    "rackId": 2,
    "shelfId": 1,
    "label": "BOX A-004: NEO 6M GPS module"
  },
  {
    "id": "BOX A-003",
    "rackId": 2,
    "shelfId": 1,
    "label": "BOX A-003: HC-05 Wireless bluetooth"
  },
  {
    "id": "BOX A-006",
    "rackId": 2,
    "shelfId": 1,
    "label": "BOX A-006: RFID AND Keypad 4*4"
  },
  {
    "id": "BOX A-002",
    "rackId": 2,
    "shelfId": 1,
    "label": "BOX A-002: SIM 7600EI LTE High speed modem"
  },
  {
    "id": "BOX A-001",
    "rackId": 2,
    "shelfId": 1,
    "label": "BOX A-001: SIM 800t Corpse cosm"
  }
];

// === INITIAL_COMPONENTS: Auto-generated from data/db.json ===
const INITIAL_COMPONENTS = [
  {
    "id": "COMP-001",
    "name": "Arduino Nano",
    "partNumber": "ATMEGA328P-NANO",
    "manufacturer": "Microchip Technology / Arduino",
    "barcode": "8901234000019",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/71/Arduino-nano.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-003",
    "stackLayer": "Layer 1 (Top Compartment Bin #3)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Compact breadboard-friendly 8-bit microcontroller board.",
    "specifications": "5V Logic, 16MHz, 32KB Flash, ATmega328P",
    "compatibleComponents": [
      "Arduino Shields",
      "Breadboard",
      "HC-SR04"
    ],
    "alternatives": [
      "COMP-002 (Arduino Uno R3)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 2,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 450,
    "tags": [
      "arduino",
      "nano"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-002",
    "name": "Arduino Uno R3",
    "partNumber": "ATMEGA328P-PU-UNO",
    "manufacturer": "Arduino / Microchip Technology",
    "barcode": "8901234000026",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-002",
    "stackLayer": "Layer 1 (Top Compartment Bin #B)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Standard prototyping microcontroller board.",
    "specifications": "5V Logic, 16MHz, 14 Digital I/O",
    "compatibleComponents": [
      "Arduino Uno Shields",
      "L298N Motor Driver"
    ],
    "alternatives": [
      "COMP-001 (Arduino Nano)"
    ],
    "inventoryState": "RESERVED",
    "quantity": 1,
    "unit": "pc",
    "minQuantity": 1,
    "unitPrice": 1800,
    "tags": [
      "arduino",
      "uno"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-003",
    "name": "Arduino R4 Minima",
    "partNumber": "ABX00080",
    "manufacturer": "Arduino / Renesas",
    "barcode": "8901234000033",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/800px-Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-010",
    "stackLayer": "Layer 1 (Top Compartment Bin #1)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "32-bit ARM Cortex-M4 board with CAN bus.",
    "specifications": "48MHz ARM Cortex-M4, 256KB Flash",
    "compatibleComponents": [
      "Arduino Shields"
    ],
    "alternatives": [
      "COMP-002 (Arduino Uno R3)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pc",
    "minQuantity": 1,
    "unitPrice": 2250,
    "tags": [
      "arduino",
      "r4"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-004",
    "name": "Teensy 4.1 Development Board",
    "partNumber": "DEV-16771",
    "manufacturer": "PJRC / NXP",
    "barcode": "8901234000040",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Teensy_3.1.jpg/800px-Teensy_3.1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-007",
    "stackLayer": "Layer 1 (Top Compartment Bin #D)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Ultra high-performance 600MHz ARM Cortex-M7 board.",
    "specifications": "600MHz ARM Cortex-M7, 8MB Flash",
    "compatibleComponents": [
      "SD Card"
    ],
    "alternatives": [
      "COMP-010 (Nvidia Jetson Nano)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pc",
    "minQuantity": 1,
    "unitPrice": 3850,
    "tags": [
      "teensy"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-005",
    "name": "Mega 2560 Pro (Embed)",
    "partNumber": "ATMEGA2560-PRO",
    "manufacturer": "RobotDyn",
    "barcode": "8901234000057",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Arduino_Mega_2560_v3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-005",
    "stackLayer": "Layer 1 (Top Compartment Bin #E)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Compact embedded Mega 2560.",
    "specifications": "16MHz ATmega2560, 256KB Flash",
    "compatibleComponents": [
      "RAMPS 1.4"
    ],
    "alternatives": [
      "COMP-002 (Arduino Uno R3)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 1250,
    "tags": [
      "mega2560"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-006",
    "name": "ESP32 Wi-Fi & Bluetooth Module",
    "partNumber": "ESP32-WROOM-32",
    "manufacturer": "Espressif Systems",
    "barcode": "8901234000064",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/ESP32-WROOM-32_on_devkit_V1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-003",
    "stackLayer": "Layer 2 (Lower Tray Bin #3)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Dual-core Wi-Fi & Bluetooth microcontroller board.",
    "specifications": "240MHz Tensilica LX6, 4MB Flash, Wi-Fi & BLE",
    "compatibleComponents": [
      "Arduino Shields",
      "DHT11",
      "HC-SR04"
    ],
    "alternatives": [
      "COMP-001 (Arduino Nano)",
      "COMP-008 (Pico W)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 8,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 480,
    "tags": [
      "esp32",
      "wifi",
      "bluetooth",
      "arduino"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-007",
    "name": "ESP CAM Module with Camera",
    "partNumber": "ESP32-CAM",
    "manufacturer": "Espressif / AI-Thinker",
    "barcode": "8901234000071",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/ESP32-WROOM-32_on_devkit_V1.jpg/800px-ESP32-WROOM-32_on_devkit_V1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-004",
    "stackLayer": "Layer 2 (Middle Bin #A)",
    "category": "Wireless & Comms",
    "purpose": "Wi-Fi + BLE module with OV2640 2MP Camera.",
    "specifications": "ESP32 dual-core 240MHz, 2MP camera",
    "compatibleComponents": [
      "FTDI Adapter"
    ],
    "alternatives": [
      "COMP-006 (ESP8266)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 650,
    "tags": [
      "espcam"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-008",
    "name": "Raspberry Pi Pico W",
    "partNumber": "RP2040-W",
    "manufacturer": "Raspberry Pi Ltd",
    "barcode": "8901234000088",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/98/Raspberry_Pi_Pico_Top.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-012",
    "stackLayer": "Layer 2 (Middle Bin #B)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Wireless-enabled RP2040 board.",
    "specifications": "Dual-core ARM Cortex-M0+ 133MHz",
    "compatibleComponents": [
      "MicroPython"
    ],
    "alternatives": [
      "COMP-001 (Arduino Nano)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 9,
    "unit": "pcs",
    "minQuantity": 3,
    "unitPrice": 580,
    "tags": [
      "picow"
    ],
    "lastUpdated": "2026-07-29",
    "datasheetUrl": "",
    "supplierInfo": {
      "vendorName": "Robu.in / Lab Vendor",
      "vendorSku": "SKU-RASP",
      "vendorUrl": "",
      "unitPrice": 580,
      "leadTimeDays": 3
    }
  },
  {
    "id": "COMP-009",
    "name": "Raspberry Pi Single Board Computer",
    "partNumber": "RPI4-4GB",
    "manufacturer": "Raspberry Pi Ltd",
    "barcode": "8901234000095",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-006",
    "stackLayer": "Layer 2 (Middle Bin #C)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Quad-core 64-bit ARM Linux single-board computer.",
    "specifications": "1.5GHz BCM2711, 4GB LPDDR4",
    "compatibleComponents": [
      "RPi Camera"
    ],
    "alternatives": [
      "COMP-010 (Jetson Nano)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pc",
    "minQuantity": 1,
    "unitPrice": 5400,
    "tags": [
      "rpi4"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-010",
    "name": "Nvidia Jetson Nano Developer Kit",
    "partNumber": "JETSON-NANO-4GB",
    "manufacturer": "NVIDIA Corporation",
    "barcode": "8901234000101",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Raspberry_Pi_4_Model_B_-_Side.jpg/800px-Raspberry_Pi_4_Model_B_-_Side.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-011",
    "stackLayer": "Layer 2 (Middle Bin #D)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "AI & Computer Vision edge computer.",
    "specifications": "Quad-core ARM A57, 128-core Maxwell GPU",
    "compatibleComponents": [
      "CSI Camera"
    ],
    "alternatives": [
      "COMP-009 (RPi4)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pc",
    "minQuantity": 1,
    "unitPrice": 14500,
    "tags": [
      "jetson"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-011",
    "name": "STM32 with ST-Link Programmer",
    "partNumber": "STM32F103C8T6",
    "manufacturer": "STMicroelectronics",
    "barcode": "8901234000118",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/STM32F103C8T6_Blue_Pill.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-013",
    "stackLayer": "Layer 3 (Bottom Bin #A)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Blue Pill STM32 ARM Cortex-M3 board with ST-Link.",
    "specifications": "72MHz ARM Cortex-M3, 64KB Flash",
    "compatibleComponents": [
      "STM32CubeIDE"
    ],
    "alternatives": [
      "COMP-013 (BlackPill)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "set",
    "minQuantity": 1,
    "unitPrice": 650,
    "tags": [
      "stm32"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-012",
    "name": "STM32 F4VE Core Board",
    "partNumber": "STM32F407VET6",
    "manufacturer": "STMicroelectronics",
    "barcode": "8901234000125",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/STM32F103C8T6_Blue_Pill.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-014",
    "stackLayer": "Layer 3 (Bottom Bin #B)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "ARM Cortex-M4 core board.",
    "specifications": "168MHz ARM Cortex-M4, 512KB Flash",
    "compatibleComponents": [
      "TFT 3.2 LCD"
    ],
    "alternatives": [
      "COMP-013 (BlackPill)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pc",
    "minQuantity": 1,
    "unitPrice": 1950,
    "tags": [
      "stm32f4"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-013",
    "name": "STM32F4DCCU6 Core Board",
    "partNumber": "STM32F401CCU6",
    "manufacturer": "STMicroelectronics",
    "barcode": "8901234000132",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/STM32F103C8T6_Blue_Pill.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-008",
    "stackLayer": "Layer 3 (Bottom Bin #C)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Black Pill STM32 ARM Cortex-M4 board.",
    "specifications": "84MHz ARM Cortex-M4, 256KB Flash",
    "compatibleComponents": [
      "ST-Link V2"
    ],
    "alternatives": [
      "COMP-011 (BluePill)"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 5,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 480,
    "tags": [
      "blackpill"
    ],
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-014",
    "name": "CP2102 USB to UART Serial Converter",
    "partNumber": "CP2102-MOD",
    "manufacturer": "Silicon Labs",
    "barcode": "8901234000149",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/USB-UART_CP2102.jpg/800px-USB-UART_CP2102.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-001",
    "stackLayer": "Layer 3 (Bottom Bin #D)",
    "category": "Connectors & Cabling",
    "purpose": "USB-to-UART bridge converter.",
    "specifications": "Baud rates up to 1 Mbps",
    "compatibleComponents": [
      "ESP-CAM"
    ],
    "alternatives": [
      "FT232RL Converter"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 2,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 190,
    "tags": [
      "cp2102"
    ],
    "lastUpdated": "2026-07-28"
  },
  {
    "id": "COMP-015",
    "name": "Metal Touch & MPR121 Touch Sensor",
    "partNumber": "MPR121-TOUCH",
    "manufacturer": "SparkFun / NXP",
    "barcode": "8901234000156",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-001",
    "stackLayer": "Layer 1 (Tray #A)",
    "category": "Sensors & Modules",
    "purpose": "Capacitive touch sensing array.",
    "specifications": "I2C interface, 12 touch inputs",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "TTP223"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 10,
    "unit": "pcs",
    "minQuantity": 3,
    "unitPrice": 220,
    "tags": [
      "touch",
      "mpr121"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-016",
    "name": "Ultrasonic Distance Sensor",
    "partNumber": "HC-SR04",
    "manufacturer": "SparkFun",
    "barcode": "8901234000163",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-002",
    "stackLayer": "Layer 1 (Tray #B)",
    "category": "Sensors & Modules",
    "purpose": "Ultrasonic distance sensor (2cm to 400cm).",
    "specifications": "5V DC, 40kHz acoustic frequency",
    "compatibleComponents": [
      "Arduino Uno R3"
    ],
    "alternatives": [
      "VL53L0X Laser Sensor"
    ],
    "inventoryState": "BORROWED",
    "quantity": 7,
    "unit": "pcs",
    "minQuantity": 3,
    "unitPrice": 180,
    "tags": [
      "ultrasonic",
      "hc-sr04"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-017",
    "name": "SW-18015P Vibration & Infrared (K) Sensor",
    "partNumber": "SW-18015P-IR",
    "manufacturer": "Generic Sensors",
    "barcode": "8901234000170",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-003",
    "stackLayer": "Layer 1 (Tray #C)",
    "category": "Sensors & Modules",
    "purpose": "Vibration tilt switches and IR obstacle sensors.",
    "specifications": "3.3V-5V DC, LM393 comparator",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "PIR Motion Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 9,
    "unit": "pcs",
    "minQuantity": 3,
    "unitPrice": 150,
    "tags": [
      "vibration",
      "infrared"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-018",
    "name": "MQ Gas Sensors Box (MQ-2, MQ-3, MQ-7, MQ-135)",
    "partNumber": "MQ-GAS-KIT",
    "manufacturer": "Hanwei Electronics",
    "barcode": "8901234000187",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-004",
    "stackLayer": "Layer 2 (Middle Tray #A)",
    "category": "Sensors & Modules",
    "purpose": "Gas detection kit (MQ-2, MQ-3, MQ-7, MQ-135).",
    "specifications": "5V DC heater, Analog & Digital output",
    "compatibleComponents": [
      "Arduino Uno"
    ],
    "alternatives": [
      "SGP30 Gas Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 10,
    "unit": "pcs",
    "minQuantity": 4,
    "unitPrice": 350,
    "tags": [
      "gas",
      "mq2",
      "mq135"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-020",
    "name": "Temperature & Humidity Sensor",
    "partNumber": "DHT11",
    "manufacturer": "Aosong Electronics",
    "barcode": "8901234000200",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/DHT11_temperature_and_humidity_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-006",
    "stackLayer": "Layer 2 (Middle Tray #C)",
    "category": "Sensors & Modules",
    "purpose": "Digital temperature and humidity sensor.",
    "specifications": "3.3V-5V DC, 20-90% RH, 0-50°C",
    "compatibleComponents": [
      "ESP8266"
    ],
    "alternatives": [
      "DHT22"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 160,
    "tags": [
      "dht11",
      "temperature"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-021",
    "name": "Sound Sensor Module",
    "partNumber": "KY-038",
    "manufacturer": "Keyes",
    "barcode": "8901234000217",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-007",
    "stackLayer": "Layer 2 (Middle Tray #D)",
    "category": "Sensors & Modules",
    "purpose": "Acoustic microphone sound detection module.",
    "specifications": "LM393 amplifier, adjustable sensitivity",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "MAX4466"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 3,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 140,
    "tags": [
      "sound",
      "microphone"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-022",
    "name": "Force Sensing Resistor (FSR)",
    "partNumber": "FSR-402",
    "manufacturer": "Interlink Electronics",
    "barcode": "8901234000224",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-008",
    "stackLayer": "Layer 3 (Bottom Tray #A)",
    "category": "Sensors & Modules",
    "purpose": "Polymer thick film force sensing resistor.",
    "specifications": "12.7mm active area, force range 0.2N-20N",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "Load Cell 5kg"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 2,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 680,
    "tags": [
      "fsr",
      "force"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-023",
    "name": "Rain Drop Sensor Board",
    "partNumber": "RAIN-SENS",
    "manufacturer": "Generic",
    "barcode": "8901234000231",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-009",
    "stackLayer": "Layer 3 (Bottom Tray #B)",
    "category": "Sensors & Modules",
    "purpose": "Raindrop moisture sensing board.",
    "specifications": "Analog & Digital output",
    "compatibleComponents": [
      "Arduino Uno"
    ],
    "alternatives": [
      "Soil Moisture Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 2,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 190,
    "tags": [
      "rain"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-024",
    "name": "Touch Sensor Module TTP 224 (4-Key)",
    "partNumber": "TTP224",
    "manufacturer": "TonTek",
    "barcode": "8901234000248",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-010",
    "stackLayer": "Layer 3 (Bottom Tray #C)",
    "category": "Sensors & Modules",
    "purpose": "4-Channel capacitive touch keypad.",
    "specifications": "TTP224 IC, 4 touch status LEDs",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "4x4 Matrix Keypad"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 3,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 210,
    "tags": [
      "ttp224"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-025",
    "name": "HC-SR501 PIR Motion Sensor Module",
    "partNumber": "HC-SR501",
    "manufacturer": "Generic",
    "barcode": "8901234000255",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-011",
    "stackLayer": "Layer 3 (Bottom Tray #D)",
    "category": "Sensors & Modules",
    "purpose": "PIR human body motion detector.",
    "specifications": "4.5V-20V input, 7m detection range",
    "compatibleComponents": [
      "Arduino Uno"
    ],
    "alternatives": [
      "RCW-0001 Ultrasonic"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 3,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 190,
    "tags": [
      "pir",
      "motion"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-026",
    "name": "Sound Sensor (Big Microphone Module)",
    "partNumber": "BIG-MIC-SOUND",
    "manufacturer": "Keyes",
    "barcode": "8901234000262",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-012",
    "stackLayer": "Layer 4 (Bottom Bin #E)",
    "category": "Sensors & Modules",
    "purpose": "Big electret microphone sound sensor.",
    "specifications": "LM393 comparator, analog/digital output",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "KY-038 Sound Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 2,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 175,
    "tags": [
      "sound",
      "bigmic"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-027",
    "name": "Soil Moisture Sensor Module",
    "partNumber": "SOIL-MOIST-V1",
    "manufacturer": "Generic AgTech",
    "barcode": "8901234000279",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-013",
    "stackLayer": "Layer 4 (Bottom Bin #F)",
    "category": "Sensors & Modules",
    "purpose": "Soil humidity moisture probe.",
    "specifications": "3.3V-5V DC, analog/digital output",
    "compatibleComponents": [
      "12V Water Pump"
    ],
    "alternatives": [
      "Capacitive Soil Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 140,
    "tags": [
      "soil",
      "moisture"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-028",
    "name": "LDR Light Dependent Resistor 5mm",
    "partNumber": "LDR-5MM",
    "manufacturer": "Generic Opto",
    "barcode": "8901234000286",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/LDR_5mm.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 5,
    "boxId": "BOX E-003",
    "stackLayer": "Layer 4 (Bottom Bin #G)",
    "category": "Passive Components",
    "purpose": "5mm photoresistors for light measurement.",
    "specifications": "10k-20k ohm light resistance",
    "compatibleComponents": [
      "10k Resistor"
    ],
    "alternatives": [
      "BH1750 Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 11,
    "unit": "pcs",
    "minQuantity": 5,
    "unitPrice": 25,
    "tags": [
      "ldr",
      "photoresistor"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-029",
    "name": "Flex Sensor & Color Sensor TCS3200",
    "partNumber": "FLEX-TCS3200",
    "manufacturer": "Spectra Symbol / TAOS",
    "barcode": "8901234000293",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-015",
    "stackLayer": "Layer 4 (Bottom Bin #H)",
    "category": "Sensors & Modules",
    "purpose": "2.2-inch Flex sensors & TCS3200 color sensors.",
    "specifications": "TCS3200 photodiode array, Flex variable resistor",
    "compatibleComponents": [
      "Arduino Uno"
    ],
    "alternatives": [
      "TCS34725 RGB Sensor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 950,
    "tags": [
      "flex",
      "colorsensor"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-030",
    "name": "Johnson DC Motor 60 RPM",
    "partNumber": "JOHNSON-60RPM",
    "manufacturer": "Johnson Electric",
    "barcode": "8901234000309",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-001",
    "stackLayer": "Heavy Drive Bin #1",
    "category": "Hardware & Tools",
    "purpose": "High torque 12V DC motor at 60 RPM.",
    "specifications": "12V DC, 60 RPM, 12 kg-cm stall torque",
    "compatibleComponents": [
      "BTS7960 Driver"
    ],
    "alternatives": [
      "Johnson 300 RPM"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 750,
    "tags": [
      "motor",
      "johnson"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-031",
    "name": "Johnson DC Motor 300 RPM 12V",
    "partNumber": "JOHNSON-300RPM",
    "manufacturer": "Johnson Electric",
    "barcode": "8901234000316",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-002",
    "stackLayer": "Heavy Drive Bin #2",
    "category": "Hardware & Tools",
    "purpose": "High-speed 12V DC geared motor at 300 RPM.",
    "specifications": "12V DC, 300 RPM, 4.5 kg-cm torque",
    "compatibleComponents": [
      "BTS7960 Driver"
    ],
    "alternatives": [
      "Johnson 200 RPM"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 6,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 750,
    "tags": [
      "motor",
      "johnson"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-032",
    "name": "Johnson DC Motor 200 RPM 12V",
    "partNumber": "JOHNSON-200RPM",
    "manufacturer": "Johnson Electric",
    "barcode": "8901234000323",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-003",
    "stackLayer": "Heavy Drive Bin #3",
    "category": "Hardware & Tools",
    "purpose": "12V DC geared motor at 200 RPM.",
    "specifications": "12V DC, 200 RPM, 6.5 kg-cm torque",
    "compatibleComponents": [
      "L298N Driver"
    ],
    "alternatives": [
      "Johnson 300 RPM"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 750,
    "tags": [
      "motor",
      "johnson"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-033",
    "name": "Johnson DC Motor 100 RPM 12V",
    "partNumber": "JOHNSON-100RPM",
    "manufacturer": "Johnson Electric",
    "barcode": "8901234000330",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-004",
    "stackLayer": "Heavy Drive Bin #4",
    "category": "Hardware & Tools",
    "purpose": "12V DC geared motor at 100 RPM.",
    "specifications": "12V DC, 100 RPM, 9.5 kg-cm torque",
    "compatibleComponents": [
      "L298N Driver"
    ],
    "alternatives": [
      "Johnson 60 RPM"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 750,
    "tags": [
      "motor",
      "johnson"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-034",
    "name": "Johnson DC Motor 30 RPM 12V",
    "partNumber": "JOHNSON-30RPM",
    "manufacturer": "Johnson Electric",
    "barcode": "8901234000347",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-005",
    "stackLayer": "Heavy Drive Bin #5",
    "category": "Hardware & Tools",
    "purpose": "Ultra high-torque 12V DC motor at 30 RPM.",
    "specifications": "12V DC, 30 RPM, 18 kg-cm torque",
    "compatibleComponents": [
      "BTS7960 Driver"
    ],
    "alternatives": [
      "Johnson 60 RPM"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 2,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 790,
    "tags": [
      "motor",
      "johnson"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-035",
    "name": "NEMA Stepper Motor",
    "partNumber": "NEMA17",
    "manufacturer": "StepperOnline",
    "barcode": "8901234000354",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Stepper_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-006",
    "stackLayer": "Heavy Drive Bin #6",
    "category": "Hardware & Tools",
    "purpose": "1.8° Bipolar 4-wire NEMA 17 stepper motor.",
    "specifications": "1.8° step angle, 1.5A phase current",
    "compatibleComponents": [
      "A4988 Driver"
    ],
    "alternatives": [
      "NEMA 23 Stepper"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 5,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 950,
    "tags": [
      "nema",
      "stepper"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-036",
    "name": "Micro Servo SG90",
    "partNumber": "SG90",
    "manufacturer": "TowerPro",
    "barcode": "8901234000361",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/TowerPro_SG90_Servo.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-007",
    "stackLayer": "Servo Tray Bin #A",
    "category": "Hardware & Tools",
    "purpose": "Lightweight 9g micro servo motor.",
    "specifications": "4.8V-6V DC, 1.8 kg-cm torque",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "MG90S Servo"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 12,
    "unit": "pcs",
    "minQuantity": 4,
    "unitPrice": 120,
    "tags": [
      "servo",
      "sg90"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-037",
    "name": "MG90S Micro Metal Gear Servo",
    "partNumber": "MG90S",
    "manufacturer": "TowerPro",
    "barcode": "8901234000378",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/TowerPro_SG90_Servo.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-008",
    "stackLayer": "Servo Tray Bin #B",
    "category": "Hardware & Tools",
    "purpose": "9g micro servo with metal gears.",
    "specifications": "4.8V-6.0V DC, 2.2 kg-cm torque",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "SG90 Servo"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 8,
    "unit": "pcs",
    "minQuantity": 3,
    "unitPrice": 220,
    "tags": [
      "servo",
      "mg90s"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-038",
    "name": "Servo MG995 High Torque Motor",
    "partNumber": "MG995",
    "manufacturer": "TowerPro",
    "barcode": "8901234000385",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/TowerPro_SG90_Servo.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-009",
    "stackLayer": "Servo Tray Bin #C",
    "category": "Hardware & Tools",
    "purpose": "Heavy-duty high torque metal gear servo.",
    "specifications": "4.8V-7.2V DC, 10 kg-cm torque",
    "compatibleComponents": [
      "PCA9685 Driver"
    ],
    "alternatives": [
      "MG945 Servo"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 480,
    "tags": [
      "servo",
      "mg995"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-039",
    "name": "Tower Pro MG945 Metal Gear Servo Motor",
    "partNumber": "MG945",
    "manufacturer": "TowerPro",
    "barcode": "8901234000392",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/TowerPro_SG90_Servo.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-010",
    "stackLayer": "Servo Tray Bin #D",
    "category": "Hardware & Tools",
    "purpose": "12 kg-cm digital metal gear servo.",
    "specifications": "4.8V-7.2V DC, 12 kg-cm torque",
    "compatibleComponents": [
      "Arduino Mega"
    ],
    "alternatives": [
      "MG995 Servo"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 3,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 520,
    "tags": [
      "servo",
      "mg945"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-040",
    "name": "12V High Quality DC Mini Submersible Water Pump",
    "partNumber": "PUMP-12V",
    "manufacturer": "Robu Hydro",
    "barcode": "8901234000408",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-011",
    "stackLayer": "Fluidic Bin #1",
    "category": "Hardware & Tools",
    "purpose": "Brushless submersible water pump.",
    "specifications": "12V DC, 240L/H flow rate, IP68",
    "compatibleComponents": [
      "5V Relay Module"
    ],
    "alternatives": [
      "5V Mini USB Pump"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 4,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 780,
    "tags": [
      "pump"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-041",
    "name": "L293 / L293D Motor Driver Shield Module",
    "partNumber": "L293D-SHIELD",
    "manufacturer": "STMicroelectronics",
    "barcode": "8901234000415",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-012",
    "stackLayer": "Driver Board Tray #A",
    "category": "Sensors & Modules",
    "purpose": "4-Channel H-Bridge motor driver shield.",
    "specifications": "Drives 4 DC motors, 0.6A per channel",
    "compatibleComponents": [
      "Arduino Uno R3"
    ],
    "alternatives": [
      "L298N Motor Driver"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 5,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 240,
    "tags": [
      "l293d",
      "motordriver"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-042",
    "name": "L298N Dual H-Bridge Motor Driver Module",
    "partNumber": "L298N",
    "manufacturer": "STMicroelectronics",
    "barcode": "8901234000422",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-013",
    "stackLayer": "Driver Board Tray #B",
    "category": "Sensors & Modules",
    "purpose": "Dual H-Bridge motor driver module.",
    "specifications": "5V-35V motor power, 2A per channel",
    "compatibleComponents": [
      "Johnson DC Motors"
    ],
    "alternatives": [
      "BTS7960 Driver"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 6,
    "unit": "pcs",
    "minQuantity": 2,
    "unitPrice": 280,
    "tags": [
      "l298n",
      "motordriver"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-043",
    "name": "BTS7960 43A High Power Motor Driver Module",
    "partNumber": "BTS7960",
    "manufacturer": "Infineon",
    "barcode": "8901234000439",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-014",
    "stackLayer": "Driver Board Tray #C",
    "category": "Sensors & Modules",
    "purpose": "43A high power H-bridge motor driver.",
    "specifications": "5.5V-27V motor power, 43A peak current",
    "compatibleComponents": [
      "Johnson DC Motor 300 RPM"
    ],
    "alternatives": [
      "L298N Motor Driver"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 3,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 650,
    "tags": [
      "bts7960",
      "43a"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-044",
    "name": "L-Shape Mounting Bracket for Johnson DC Motor",
    "partNumber": "JOHNSON-BRACKET",
    "manufacturer": "Robu Mechanics",
    "barcode": "8901234000446",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-015",
    "stackLayer": "Hardware Tray #1",
    "category": "Hardware & Tools",
    "purpose": "3mm steel L-bracket for Johnson DC motors.",
    "specifications": "3mm steel construction, M3 & M4 holes",
    "compatibleComponents": [
      "Johnson DC Motors"
    ],
    "alternatives": [
      "Universal Bracket"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 10,
    "unit": "pcs",
    "minQuantity": 4,
    "unitPrice": 85,
    "tags": [
      "bracket",
      "johnson"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-045",
    "name": "Female 2.54mm 2P Dupont Housing",
    "partNumber": "DUPONT-2P-FEMALE",
    "manufacturer": "Harwin",
    "barcode": "8901234000453",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-001",
    "stackLayer": "Organizer Drawer #1",
    "category": "Connectors & Cabling",
    "purpose": "2.54mm pitch female dupont connector housings.",
    "specifications": "2.54mm pitch, 2-position female housing",
    "compatibleComponents": [
      "Female Crimp Pins"
    ],
    "alternatives": [
      "JST XH Connector"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 150,
    "unit": "pcs",
    "minQuantity": 50,
    "unitPrice": 2.5,
    "tags": [
      "dupont",
      "2.54mm"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-046",
    "name": "Female 2.54mm Crimp Terminal Pins",
    "partNumber": "DUPONT-FEMALE-PIN",
    "manufacturer": "Harwin",
    "barcode": "8901234000460",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-002",
    "stackLayer": "Organizer Drawer #2",
    "category": "Connectors & Cabling",
    "purpose": "Female crimp terminal contacts for dupont wire.",
    "specifications": "24-28 AWG wire gauge",
    "compatibleComponents": [
      "Dupont Housings"
    ],
    "alternatives": [
      "Male Crimp Pins"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 300,
    "unit": "pcs",
    "minQuantity": 100,
    "unitPrice": 1.2,
    "tags": [
      "crimp",
      "female-pin"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-047",
    "name": "Male 2.54mm Crimp Terminal Pins",
    "partNumber": "DUPONT-MALE-PIN",
    "manufacturer": "Harwin",
    "barcode": "8901234000477",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-003",
    "stackLayer": "Organizer Drawer #3",
    "category": "Connectors & Cabling",
    "purpose": "Male crimp terminal pins for dupont headers.",
    "specifications": "24-28 AWG wire gauge",
    "compatibleComponents": [
      "Dupont Housings"
    ],
    "alternatives": [
      "Female Crimp Pins"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 250,
    "unit": "pcs",
    "minQuantity": 100,
    "unitPrice": 1.2,
    "tags": [
      "crimp",
      "male-pin"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-048",
    "name": "JST VH Connectors & Crimp Set",
    "partNumber": "JST-VH-3.96",
    "manufacturer": "JST Mfg Co",
    "barcode": "8901234000484",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Organizer Drawer #4",
    "category": "Connectors & Cabling",
    "purpose": "3.96mm pitch power connector set.",
    "specifications": "3.96mm pitch, 10A current rating",
    "compatibleComponents": [
      "Power Supply Wires"
    ],
    "alternatives": [
      "JST XH Connector"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 45,
    "unit": "pcs",
    "minQuantity": 15,
    "unitPrice": 12,
    "tags": [
      "jst-vh"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-049",
    "name": "JST XH Connectors & Crimp Set",
    "partNumber": "JST-XH-2.5",
    "manufacturer": "JST Mfg Co",
    "barcode": "8901234000491",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Organizer Drawer #5",
    "category": "Connectors & Cabling",
    "purpose": "2.5mm pitch LiPo battery balance connectors.",
    "specifications": "2.5mm pitch, 3A rating",
    "compatibleComponents": [
      "LiPo Balance Charger"
    ],
    "alternatives": [
      "Dupont Housing"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 80,
    "unit": "pcs",
    "minQuantity": 25,
    "unitPrice": 8,
    "tags": [
      "jst-xh"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-050",
    "name": "Screw Terminal Block 5.08mm 2-Pin",
    "partNumber": "SCREW-TERM-5.08-2P",
    "manufacturer": "Phoenix Contact",
    "barcode": "8901234000507",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-006",
    "stackLayer": "Terminal Block Compartment #A",
    "category": "Connectors & Cabling",
    "purpose": "5.08mm pitch 2-position PCB screw terminal blocks.",
    "specifications": "5.08mm pitch, 16A 300V AC rating",
    "compatibleComponents": [
      "L298N Driver"
    ],
    "alternatives": [
      "Screw Terminal 3-Pin"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 40,
    "unit": "pcs",
    "minQuantity": 15,
    "unitPrice": 9.5,
    "tags": [
      "screw-terminal"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-051",
    "name": "Terminal Block Connector 3-Pin",
    "partNumber": "SCREW-TERM-5.08-3P",
    "manufacturer": "Phoenix Contact",
    "barcode": "8901234000514",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-007",
    "stackLayer": "Terminal Block Compartment #B",
    "category": "Connectors & Cabling",
    "purpose": "5.08mm pitch 3-position PCB screw terminal blocks.",
    "specifications": "5.08mm pitch, 16A rating",
    "compatibleComponents": [
      "5V Relay Module"
    ],
    "alternatives": [
      "Screw Terminal 2-Pin"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 30,
    "unit": "pcs",
    "minQuantity": 10,
    "unitPrice": 14,
    "tags": [
      "screw-terminal"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-052",
    "name": "Quick Wire Connector Clamp",
    "partNumber": "WAGO-STYLE-221",
    "manufacturer": "WAGO",
    "barcode": "8901234000521",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 5,
    "boxId": "BOX E-004",
    "stackLayer": "Quick Splicing Bin #1",
    "category": "Connectors & Cabling",
    "purpose": "Tool-free lever lock quick wire splicing clamps.",
    "specifications": "32A 450V rating, 24-12 AWG",
    "compatibleComponents": [
      "12V Power Wires"
    ],
    "alternatives": [
      "Screw Terminal"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 25,
    "unit": "pcs",
    "minQuantity": 10,
    "unitPrice": 18,
    "tags": [
      "wago",
      "lever-nut"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-054",
    "name": "Male & Female Bullet Connectors 3.5mm",
    "partNumber": "BULLET-3.5MM",
    "manufacturer": "AMASS",
    "barcode": "8901234000545",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-010",
    "stackLayer": "High Current Battery Bin #2",
    "category": "Connectors & Cabling",
    "purpose": "3.5mm gold-plated bullet connectors.",
    "specifications": "3.5mm diameter, 45A max current",
    "compatibleComponents": [
      "BLDC Motor"
    ],
    "alternatives": [
      "XT60 Connector"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 20,
    "unit": "pairs",
    "minQuantity": 8,
    "unitPrice": 25,
    "tags": [
      "bullet-connector"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-055",
    "name": "USB Female 3.0 Panel Mount Port",
    "partNumber": "USB3-PANEL-MOUNT",
    "manufacturer": "Amphenol",
    "barcode": "8901234000552",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-011",
    "stackLayer": "USB Hardware Drawer #1",
    "category": "Connectors & Cabling",
    "purpose": "9-Pin USB 3.0 Type-A female panel mount socket.",
    "specifications": "USB 3.0 5Gbps, 9-pin DIP",
    "compatibleComponents": [
      "Raspberry Pi 4"
    ],
    "alternatives": [
      "Mini USB Port"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 8,
    "unit": "pcs",
    "minQuantity": 3,
    "unitPrice": 35,
    "tags": [
      "usb3"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-056",
    "name": "Mini USB Type-B Port Connectors",
    "partNumber": "MINI-USB-5P",
    "manufacturer": "Molex",
    "barcode": "8901234000569",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-012",
    "stackLayer": "USB Hardware Drawer #2",
    "category": "Connectors & Cabling",
    "purpose": "Right-angle 5-pin DIP Mini-USB female sockets.",
    "specifications": "5-pin Mini-B format, right angle",
    "compatibleComponents": [
      "Arduino Nano"
    ],
    "alternatives": [
      "Micro-USB Port"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 18,
    "unit": "pcs",
    "minQuantity": 5,
    "unitPrice": 15,
    "tags": [
      "mini-usb"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-057",
    "name": "White Silicon Wire 20mm",
    "partNumber": "SILICONE-WIRE-20AWG",
    "manufacturer": "BN-TECH",
    "barcode": "8901234000576",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 5,
    "boxId": "BOX E-004",
    "stackLayer": "Wire Spool Compartment #1",
    "category": "Connectors & Cabling",
    "purpose": "20 AWG white high-temperature silicone wire.",
    "specifications": "200°C temperature rating, tinned copper",
    "compatibleComponents": [
      "Johnson DC Motor"
    ],
    "alternatives": [
      "Red/Black Silicone Wire"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 20,
    "unit": "meters",
    "minQuantity": 5,
    "unitPrice": 35,
    "tags": [
      "silicone-wire"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-058",
    "name": "Heatshrink Sleeve 3.5m",
    "partNumber": "HEATSHRINK-3.5MM",
    "manufacturer": "Generic",
    "barcode": "8901234000583",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-014",
    "stackLayer": "Insulation Tubing Drawer #1",
    "category": "Hardware & Tools",
    "purpose": "3.5mm 2:1 shrink ratio polyolefin heatshrink tubing.",
    "specifications": "3.5mm diameter, 2:1 shrink ratio",
    "compatibleComponents": [
      "Solder Joints"
    ],
    "alternatives": [
      "Electrical Tape"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 15,
    "unit": "meters",
    "minQuantity": 5,
    "unitPrice": 20,
    "tags": [
      "heatshrink"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-059",
    "name": "100 Ohm Carbon Film Resistors 1/4W",
    "partNumber": "RES-100R-0.25W",
    "manufacturer": "Yageo",
    "barcode": "8901234000590",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 5,
    "boxId": "BOX E-005",
    "stackLayer": "Passive Component Tray #1",
    "category": "Passive Components",
    "purpose": "100 Ohm 5% 0.25W carbon film resistors.",
    "specifications": "100 Ohms, 0.25W (1/4W), ±5% tolerance",
    "compatibleComponents": [
      "LEDs",
      "Breadboard"
    ],
    "alternatives": [
      "220 Ohm Resistor"
    ],
    "inventoryState": "AVAILABLE",
    "quantity": 200,
    "unit": "pcs",
    "minQuantity": 50,
    "unitPrice": 1,
    "tags": [
      "resistor",
      "100ohm"
    ],
    "lastUpdated": "2026-07-27"
  },
  {
    "id": "COMP-0597",
    "name": "ESP 8266",
    "partNumber": "NODEMCU",
    "manufacturer": "Lab Component Vendor",
    "barcode": "8901234950597",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/ESP8266_NodeMCU_v3.jpg",
    "datasheetUrl": "",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-009",
    "stackLayer": "Layer 1 (Top Compartment Bin #A)",
    "inventoryState": "AVAILABLE",
    "category": "Microcontrollers & Dev Boards",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 450,
    "purpose": "Standard laboratory electronic component.",
    "specifications": "Standard operating parameters.",
    "compatibleComponents": [],
    "alternatives": [],
    "tags": [],
    "supplierInfo": {
      "vendorName": "Robu.in / Lab Vendor",
      "vendorSku": "SKU-ESP ",
      "vendorUrl": "",
      "unitPrice": 450,
      "leadTimeDays": 3
    },
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-4710",
    "name": "Arduino Protoshield",
    "partNumber": "PN-ARDUI",
    "manufacturer": "Lab Component Vendor",
    "barcode": "8901234294710",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "datasheetUrl": "",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX A-015",
    "stackLayer": "Layer 1 (Top Compartment Bin #A)",
    "inventoryState": "AVAILABLE",
    "category": "Microcontrollers & Dev Boards",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 450,
    "purpose": "Standard laboratory electronic component.",
    "specifications": "Standard operating parameters.",
    "compatibleComponents": [],
    "alternatives": [],
    "tags": [],
    "supplierInfo": {
      "vendorName": "Robu.in / Lab Vendor",
      "vendorSku": "SKU-ARDU",
      "vendorUrl": "",
      "unitPrice": 450,
      "leadTimeDays": 3
    },
    "lastUpdated": "2026-07-29"
  },
  {
    "id": "COMP-0987",
    "name": "IR Remote kit",
    "partNumber": "COMP-0987-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000987",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-009",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Wireless & Comms",
    "purpose": "Laboratory component entry for IR Remote kit.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "wireless & comms",
      "ir"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-3859",
    "name": "Jumper wires",
    "partNumber": "COMP-3859-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003859",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-013",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for Jumper wires.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jumper"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-7465",
    "name": "UNO Acrylic Case",
    "partNumber": "COMP-7465-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234007465",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-008",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for UNO Acrylic Case.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "uno"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-9577",
    "name": "Pulse sensor and capacitive touch sensor-TTP 223",
    "partNumber": "COMP-9577-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009577",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-007",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for Pulse sensor and capacitive touch sensor-TTP 223.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "pulse"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-1197",
    "name": "White Silicon wire 20mm",
    "partNumber": "COMP-1197-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234001197",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-007",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for White Silicon wire 20mm.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "white"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-3105",
    "name": "ESP Power distribution board",
    "partNumber": "COMP-3105-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003105",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 1,
    "boxId": "BOX D-006",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for ESP Power distribution board.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "esp"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-0156",
    "name": "9V Lithium ion USB Rechargable",
    "partNumber": "COMP-0156-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000156",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-006",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for 9V Lithium ion USB Rechargable.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "9v"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8651",
    "name": "SPDT MTS-103",
    "partNumber": "COMP-8651-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008651",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Rocker_switch.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Switches & Controls",
    "purpose": "Laboratory component entry for SPDT MTS-103.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "switches & controls",
      "spdt"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8216",
    "name": "E18-D8ON Photoelecric switch",
    "partNumber": "COMP-8216-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008216",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/LDR_5mm.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for E18-D8ON Photoelecric switch.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "e18-d8on"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-3530",
    "name": "Calonix momentary 6A switch",
    "partNumber": "COMP-3530-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003530",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Rocker_switch.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-003",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Switches & Controls",
    "purpose": "Laboratory component entry for Calonix momentary 6A switch.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "switches & controls",
      "calonix"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-3265",
    "name": "Standoff and Black plastic corner protector",
    "partNumber": "COMP-3265-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003265",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-002",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Switches & Controls",
    "purpose": "Laboratory component entry for Standoff and Black plastic corner protector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "switches & controls",
      "standoff"
    ],
    "lastUpdated": "2026-08-05"
  },
  {
    "id": "COMP-9656",
    "name": "Wireholder for Aluminium exposure",
    "partNumber": "COMP-9656-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009656",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 4,
    "boxId": "BOX D-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Switches & Controls",
    "purpose": "Laboratory component entry for Wireholder for Aluminium exposure.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "switches & controls",
      "wireholder"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8578",
    "name": "2 channel 5V Relay",
    "partNumber": "COMP-8578-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008578",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-013",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Motors & Drivers",
    "purpose": "Laboratory component entry for 2 channel 5V Relay.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "motors & drivers",
      "2"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-4793",
    "name": "Single channel  Relay",
    "partNumber": "COMP-4793-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234004793",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-012",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Motors & Drivers",
    "purpose": "Laboratory component entry for Single channel 5V Relay.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "motors & drivers",
      "single"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-2662",
    "name": "13 Batteries",
    "partNumber": "COMP-2662-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234002662",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-011",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "General Components",
    "purpose": "Laboratory component entry for 13 Batteries.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "general components",
      "13"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6170",
    "name": "2 Cell battery holder",
    "partNumber": "COMP-6170-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006170",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-009",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for 2 Cell battery holder.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "2"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-3004",
    "name": "2 Cell battery holder",
    "partNumber": "COMP-3004-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003004",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-009",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for 2 Cell battery holder.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "2"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-4221",
    "name": "Single cell battery holder",
    "partNumber": "COMP-4221-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234004221",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-008",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for Single cell battery holder.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "single"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6776",
    "name": "4 Cell Battery holder",
    "partNumber": "COMP-6776-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006776",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-007",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for 4 Cell Battery holder.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "4"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5724",
    "name": "Booster converter module X260096",
    "partNumber": "COMP-5724-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005724",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/L298N_motor_driver_module.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-006",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for Booster converter module X260096.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "booster"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0277",
    "name": "Battery",
    "partNumber": "COMP-0277-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000277",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for Battery.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "battery"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5937",
    "name": "UBEC 5A",
    "partNumber": "COMP-5937-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005937",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/L298N_motor_driver_module.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for UBEC 5A.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "ubec"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8671",
    "name": "Lithium Battery level indicator",
    "partNumber": "COMP-8671-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008671",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-003",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for Lithium Battery level indicator.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "lithium"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6568",
    "name": "Micro Lithium Cell passive buzzer 5mm",
    "partNumber": "COMP-6568-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006568",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-002",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for Micro Lithium Cell passive buzzer 5mm.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "micro"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9566",
    "name": "Lithium-ion rechargable Battery(3.7V)",
    "partNumber": "COMP-9566-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009566",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/18650_Li-Ion_cell.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Power & Energy",
    "purpose": "Laboratory component entry for Lithium-ion rechargable Battery(3.7V).",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "power & energy",
      "lithium-ion"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6726",
    "name": "4 digit 7-segment display module",
    "partNumber": "COMP-6726-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006726",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8e/7-segment_display.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-009",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Displays & Indicators",
    "purpose": "Laboratory component entry for 4 digit 7-segment display module.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "displays & indicators",
      "4"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8149",
    "name": "LCD 2004 parallel display",
    "partNumber": "COMP-8149-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008149",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d6/16x2_LCD_module.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-008",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Displays & Indicators",
    "purpose": "Laboratory component entry for LCD 2004 parallel display.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "displays & indicators",
      "lcd"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5221",
    "name": "8*8 LED DOT Matrix module",
    "partNumber": "COMP-5221-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005221",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8e/7-segment_display.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-007",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Displays & Indicators",
    "purpose": "Laboratory component entry for 8*8 LED DOT Matrix module.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "displays & indicators",
      "8*8"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8893",
    "name": "16*02 LCD Display",
    "partNumber": "COMP-8893-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008893",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d6/16x2_LCD_module.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-006",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Displays & Indicators",
    "purpose": "Laboratory component entry for 16*02 LCD Display.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "displays & indicators",
      "16*02"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-4572",
    "name": "Traffic light with DHT 11 and ESP 32",
    "partNumber": "COMP-4572-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234004572",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/ESP32-WROOM-32_on_devkit_V1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for Traffic light with DHT 11 and ESP 32.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "traffic"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-3204",
    "name": "Traffic light with DHT 11 and ESP 32",
    "partNumber": "COMP-3204-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003204",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/ESP32-WROOM-32_on_devkit_V1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-002",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for Traffic light with DHT 11 and ESP 32.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "traffic"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6814",
    "name": "Traffic light with DHT 11 and ESP 32",
    "partNumber": "COMP-6814-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006814",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/ESP32-WROOM-32_on_devkit_V1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-003",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for Traffic light with DHT 11 and ESP 32.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "traffic"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6881",
    "name": "Traffic light with DHT 11 and ESP 32",
    "partNumber": "COMP-6881-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006881",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/ESP32-WROOM-32_on_devkit_V1.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for Traffic light with DHT 11 and ESP 32.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "traffic"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8993",
    "name": "Traffic light",
    "partNumber": "COMP-8993-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008993",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/LDR_5mm.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 2,
    "boxId": "BOX B-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Microcontrollers & Dev Boards",
    "purpose": "Laboratory component entry for Traffic light.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "microcontrollers & dev boards",
      "traffic"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9808",
    "name": "NEO 6M GPS module",
    "partNumber": "COMP-9808-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009808",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 1,
    "boxId": "BOX A-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Wireless & Comms",
    "purpose": "Laboratory component entry for NEO 6M GPS module.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "wireless & comms",
      "neo"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8538",
    "name": "HC-05 Wireless bluetooth",
    "partNumber": "COMP-8538-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008538",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 1,
    "boxId": "BOX A-003",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Wireless & Comms",
    "purpose": "Laboratory component entry for HC-05 Wireless bluetooth.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "wireless & comms",
      "hc-05"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5194",
    "name": "RFID AND Keypad 4*4",
    "partNumber": "COMP-5194-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005194",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 1,
    "boxId": "BOX A-002",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Wireless & Comms",
    "purpose": "Laboratory component entry for RFID AND Keypad 4*4.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "wireless & comms",
      "rfid"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0689",
    "name": "SIM 7600EI LTE High speed modem",
    "partNumber": "COMP-0689-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000689",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 1,
    "boxId": "BOX A-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Wireless & Comms",
    "purpose": "Laboratory component entry for SIM 7600EI LTE High speed modem.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "wireless & comms",
      "sim"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9011",
    "name": "SIM 800t Corpse cosm",
    "partNumber": "COMP-9011-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009011",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 102 - Storage Bay",
    "rackId": 2,
    "shelfId": 1,
    "boxId": "BOX A-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Wireless & Comms",
    "purpose": "Laboratory component entry for SIM 800t Corpse cosm.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "wireless & comms",
      "sim"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-1835",
    "name": "Dupoint Crimming Terminal pins",
    "partNumber": "COMP-1835-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234001835",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-002",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for Dupoint Crimming Terminal pins.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "dupoint"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5641",
    "name": "USB TO B Cable",
    "partNumber": "COMP-5641-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005641",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-012",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for USB TO B Cable.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "usb"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-2349",
    "name": "USB Female 3D",
    "partNumber": "COMP-2349-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234002349",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-011",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for USB Female 3D.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "usb"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9582",
    "name": "JST VH 2-PIN Female Connector",
    "partNumber": "COMP-9582-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009582",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST VH 2-PIN Female Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-3915",
    "name": "JST XH 2-PIN Female Connector",
    "partNumber": "COMP-3915-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003915",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 2-PIN Female Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5024",
    "name": "JST VH 2-PIN Male Connector",
    "partNumber": "COMP-5024-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005024",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST VH 2-PIN Male Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9102",
    "name": "JST XH 2-PIN Male Connector",
    "partNumber": "COMP-9102-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009102",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 2-PIN Male Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-4402",
    "name": "JST VH 3-PIN Female Connector",
    "partNumber": "COMP-4402-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234004402",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST VH 3-PIN Female Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0601",
    "name": "JST XH 3-PIN Female Connector",
    "partNumber": "COMP-0601-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000601",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 3-PIN Female Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-4753",
    "name": "JST VH 3-PIN Male Connector",
    "partNumber": "COMP-4753-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234004753",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST VH 3-PIN Male Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0228",
    "name": "JST VH 3-PIN Male Connector",
    "partNumber": "COMP-0228-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000228",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-004",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST VH 3-PIN Male Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9959",
    "name": "JST XH 3-PIN Male Connector",
    "partNumber": "COMP-9959-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009959",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 3-PIN Male Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-7271",
    "name": "JST XH 5-PIN Female Connector",
    "partNumber": "COMP-7271-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234007271",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 5-PIN Female Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0423",
    "name": "JST XH 4PIN Female Connector",
    "partNumber": "COMP-0423-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000423",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 4PIN Female Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-5380",
    "name": "JST XH 4PIN Male Connector",
    "partNumber": "COMP-5380-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234005380",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dupont_wire.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-005",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for JST XH 4PIN Male Connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "jst"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-8141",
    "name": "4-PIN Dupoint connector",
    "partNumber": "COMP-8141-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234008141",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for 4-PIN Dupoint connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "4-pin"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-4620",
    "name": "2-PIN Dupoint connector",
    "partNumber": "COMP-4620-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234004620",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Connectors & Cabling",
    "purpose": "Laboratory component entry for 2-PIN Dupoint connector.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "connectors & cabling",
      "2-pin"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0134",
    "name": "Motor driver to arduino crimped",
    "partNumber": "COMP-0134-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000134",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/66/Small_DC_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 4,
    "boxId": "BOX D-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Motors & Drivers",
    "purpose": "Laboratory component entry for Motor driver to arduino crimped.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "motors & drivers",
      "motor"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-1258",
    "name": "MG995 Servo",
    "partNumber": "COMP-1258-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234001258",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/TowerPro_SG90_Servo.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-009",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Motors & Drivers",
    "purpose": "Laboratory component entry for MG995 Servo.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "motors & drivers",
      "mg995"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-1499",
    "name": "Stepper motor with driver board",
    "partNumber": "COMP-1499-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234001499",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Stepper_motor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-006",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Motors & Drivers",
    "purpose": "Laboratory component entry for Stepper motor with driver board.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "motors & drivers",
      "stepper"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-1273",
    "name": "LDR Sensor",
    "partNumber": "COMP-1273-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234001273",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/LDR_5mm.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-014",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for LDR Sensor.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "ldr"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-7145",
    "name": "LDR",
    "partNumber": "COMP-7145-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234007145",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/LDR_5mm.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-014",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for LDR.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "ldr"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-7470",
    "name": "PWM Driver",
    "partNumber": "COMP-7470-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234007470",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/L298N_motor_driver_module.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 3,
    "boxId": "BOX C-012",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Motors & Drivers",
    "purpose": "Laboratory component entry for PWM Driver.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "motors & drivers",
      "pwm"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9667",
    "name": "GY-271",
    "partNumber": "COMP-9667-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009667",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-006",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for GY-271.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "gy-271"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-3230",
    "name": "HC-SR501",
    "partNumber": "COMP-3230-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234003230",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-011",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "General Components",
    "purpose": "Laboratory component entry for HC-SR501.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "general components",
      "hc-sr501"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-9271",
    "name": "Forse sensing sensor",
    "partNumber": "COMP-9271-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234009271",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-008",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for Forse sensing sensor.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "forse"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-0536",
    "name": "Fingerprint Reader",
    "partNumber": "COMP-0536-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234000536",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-001",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for Fingerprint Reader.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "fingerprint"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-7352",
    "name": "Waterflow Sensor",
    "partNumber": "COMP-7352-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234007352",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-009",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for Waterflow Sensor.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "waterflow"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6665",
    "name": "BFD-1000 5-channel IR line Tracking Sensor",
    "partNumber": "COMP-6665-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234006665",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-003",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for BFD-1000 5-channel IR line Tracking Sensor.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "bfd-1000"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-1403",
    "name": "Infrared(IR) Sensor",
    "partNumber": "COMP-1403-PART",
    "manufacturer": "LabSphere Verified Vendor",
    "barcode": "8901234001403",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ultrasonic_sensor.jpg",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 1,
    "shelfId": 2,
    "boxId": "BOX B-003",
    "stackLayer": "Layer 1 (Main Storage Compartment)",
    "category": "Sensors & Modules",
    "purpose": "Laboratory component entry for Infrared(IR) Sensor.",
    "specifications": "Standard Spec",
    "compatibleComponents": [
      "Arduino",
      "Raspberry Pi",
      "Breadboard"
    ],
    "alternatives": [],
    "inventoryState": "AVAILABLE",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 150,
    "tags": [
      "sensors & modules",
      "infrared(ir)"
    ],
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-3239",
    "name": "XL 7015 Stepdown Converter",
    "partNumber": "PN-XL 70",
    "manufacturer": "Lab Component Vendor",
    "barcode": "8901234623239",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/L298N_motor_driver_module.jpg",
    "datasheetUrl": "",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-010",
    "stackLayer": "Layer 1 (Top Compartment Bin #A)",
    "inventoryState": "AVAILABLE",
    "category": "Microcontrollers & Dev Boards",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 450,
    "purpose": "Standard laboratory electronic component.",
    "specifications": "Standard operating parameters.",
    "compatibleComponents": [],
    "alternatives": [],
    "tags": [],
    "supplierInfo": {
      "vendorName": "Robu.in / Lab Vendor",
      "vendorSku": "SKU-XL 7",
      "vendorUrl": "",
      "unitPrice": 450,
      "leadTimeDays": 3
    },
    "lastUpdated": "2026-08-04"
  },
  {
    "id": "COMP-6126",
    "name": "XL 4015 dc-dc Buck coverter",
    "partNumber": "PN-XL 40",
    "manufacturer": "Lab Component Vendor",
    "barcode": "8901234696126",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/L298N_motor_driver_module.jpg",
    "datasheetUrl": "",
    "labName": "Main Robotics & Embedded Systems Lab",
    "roomName": "Room 101 - Prototyping Hall",
    "rackId": 2,
    "shelfId": 3,
    "boxId": "BOX C-010",
    "stackLayer": "Layer 1 (Top Compartment Bin #A)",
    "inventoryState": "AVAILABLE",
    "category": "Microcontrollers & Dev Boards",
    "quantity": 1,
    "unit": "pcs",
    "minQuantity": 1,
    "unitPrice": 450,
    "purpose": "Standard laboratory electronic component.",
    "specifications": "Standard operating parameters.",
    "compatibleComponents": [],
    "alternatives": [],
    "tags": [],
    "supplierInfo": {
      "vendorName": "Robu.in / Lab Vendor",
      "vendorSku": "SKU-XL 4",
      "vendorUrl": "",
      "unitPrice": 450,
      "leadTimeDays": 3
    },
    "lastUpdated": "2026-08-04"
  }
];

const INITIAL_USERS = [
  { id: "USR-1001", username: "admin", email: "admin@labsphere.io", passwordHash: "admin123", role: "ADMIN", fullName: "Lab Administrator", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1002", username: "engineer", email: "engineer@labsphere.io", passwordHash: "eng123", role: "ENGINEER", fullName: "Lead Lab Engineer", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1003", username: "researcher", email: "researcher@labsphere.io", passwordHash: "research123", role: "MANAGEMENT", fullName: "Research Associate", status: "ACTIVE", createdAt: "2026-08-01" },
  { id: "USR-1004", username: "student", email: "student@labsphere.io", passwordHash: "student123", role: "STUDENT", fullName: "Student Intern", status: "ACTIVE", createdAt: "2026-08-01" }
];

const INITIAL_PROJECTS = [
  {
    id: "PROJ-101",
    projectName: "IoT Weather Station & Environmental Monitor",
    leaderName: "Lead Lab Engineer",
    description: "Multi-sensor weather telemetry box with solar power management and LoRaWAN transmission.",
    members: ["Lead Lab Engineer", "Student Intern", "Dr. Alex Mercer"],
    bom: ["ESP32-WROOM-32", "DHT22 Temperature & Humidity Sensor", "0.96 inch OLED Display", "Solar Charge Controller Module"],
    createdAt: "2026-08-05"
  },
  {
    id: "PROJ-102",
    projectName: "Autonomous Mobile Robot (AMR) Navigation",
    leaderName: "Student Intern",
    description: "ROS2-powered differential drive obstacle avoidance robot with LiDAR scanning & IMU telemetry.",
    members: ["Student Intern", "Lead Lab Engineer"],
    bom: ["Raspberry Pi 4 Model B", "L298N Motor Driver", "HC-SR04 Ultrasonic Sensor"],
    createdAt: "2026-08-08"
  },
  {
    id: "PROJ-103",
    projectName: "Smart Microgrid Solar Power Tracker",
    leaderName: "Research Associate",
    description: "Dual-axis solar tracking array with automated MPPT battery charging efficiency monitoring.",
    members: ["Research Associate", "Lab Administrator"],
    bom: ["Arduino Uno R3", "Servo Motor SG90", "LDR Light Sensors"],
    createdAt: "2026-08-10"
  }
const INITIAL_REQUESTS = [
  {
    id: "REQ-8012-1",
    batchId: "REQ-BATCH-8012",
    componentId: "COMP-002",
    componentName: "Arduino Uno R3",
    requesterName: "Student Intern",
    role: "Student / Intern",
    projectId: "PROJ-101",
    projectName: "IoT Weather Station & Environmental Monitor",
    qtyRequested: 2,
    qtyApproved: 2,
    returnedQty: 0,
    damagedQty: 0,
    status: "SUBMITTED",
    requestedAt: new Date(Date.now() - 3600000 * 2).toLocaleString(),
    notes: "[Batch REQ-BATCH-8012] Project: 'IoT Weather Station'. Required for sensor array micro-controller setup."
  },
  {
    id: "REQ-8012-2",
    batchId: "REQ-BATCH-8012",
    componentId: "COMP-015",
    componentName: "HC-SR04 Ultrasonic Distance Sensor",
    requesterName: "Student Intern",
    role: "Student / Intern",
    projectId: "PROJ-101",
    projectName: "IoT Weather Station & Environmental Monitor",
    qtyRequested: 1,
    qtyApproved: 1,
    returnedQty: 0,
    damagedQty: 0,
    status: "SUBMITTED",
    requestedAt: new Date(Date.now() - 3600000 * 2).toLocaleString(),
    notes: "[Batch REQ-BATCH-8012] Project: 'IoT Weather Station'. Prototyping distance measurement."
  },
  {
    id: "REQ-9045-1",
    batchId: "REQ-BATCH-9045",
    componentId: "COMP-034",
    componentName: "Servo Motor SG90 (Micro Servo 9g)",
    requesterName: "Dr. Sarah Jenkins",
    role: "Lab Engineer",
    projectId: "PROJ-102",
    projectName: "Autonomous Mobile Robot (AMR) Navigation",
    qtyRequested: 3,
    qtyApproved: 3,
    returnedQty: 0,
    damagedQty: 0,
    status: "SUBMITTED",
    requestedAt: new Date(Date.now() - 3600000 * 5).toLocaleString(),
    notes: "Robotics arm steering actuator testing."
  }
];


# Welcome to OpenGrow!

OpenGrow is a complete IoT solution for monitoring the soil moisture and light availability for your indoor plants.

Your plant is also automatically watered 24/7 according to soil moisture setpoints which you can set and update at any time!

OpenGrow is easy to set-up and in this guide I will detail the steps to running OpenGrow in your own home.

# Table of Contents

1. System Architecture
2. Parts List
3. Web Application Set-Up
  1. MongoDB Database
  2. MQTT Broker
  3. Web App
4. Flash ESP8266 NodeMCU
5. Flash STM32 FreeRTOS Firmware
6. Electrical Schematic
7. Done!

## System Architecture

This complete IoT solution can be broken up into 3 parts:
1. Web Application
2. MQTT Broker
3. Firmware & Electronics

The following diagram illustrates interaction between these components.
<br />

<img src="images/OpenGrow_Block_Diagram.jpg" />

## Parts List

| Part  | Quantity | Description |
| -------- | ---- | ---- |
| STM NUCLEO-STM32F446 | 1 | Evaluation board for the STM32F446RE processor based on ARM Cortex M4 core. Any STM43F4 series processor will do here |
| ESP8266 NodeMCU | 1 | Low-cost wi-fi integated microchip where we can run the NodeMCU firmware framework |
| Digilent Pmod OLED: 128 x 32 Pixel Monochromatic OLED Display | 1 | Not a necessary component but cool to have! Not much trouble to modify code to work with any SSD1306 based display. |
| Soil Moisture Sensor | 1 | Capacitive soil moisture sensor which outputs an analog voltage signal |
| Submersible Water Pump | 1 | Pushes water from an outlet where we attach some tubing leading into the potted plant |
| 2N222A BJT | 1 | Very popular and cheap transistor to switch our pump |
| 330 Ohm Resistor | 1 | Placed at base of the transistor used to toggle the pump |
| Photoresistor | 1 | Resistance of this component is proportional to ambient light |
| 10 Kiloohm Resistor | 1 | Used to create a voltage divider with the photoresistor where we can take analog voltage reading |






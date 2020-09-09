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


<img src="images/OpenGrow_Block_Diagram.jpg" />

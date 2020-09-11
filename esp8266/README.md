## Preparing NodeMCU Firmware

The NodeMCU packages used for this application include MQTT, Bit, Wifi, GPIO, Timer and File. I have provided the built firmware binaries in esp8266>nodemcu-firmware-build which can be flashed using esptool.py following [this procedure](https://nodemcu.readthedocs.io/en/master/flash/).

Now we will fill-in the configuration files for the ESP.

## Fill in Credentials

### Device Info

In 'device_info.lua', fill the ID of any plant which you have created in the database. Your ESP will use this ID in the topic string it publishes data to. Likewise, your web application will send messages to a topic containing the ID string which ESP will subscribe to.

### Wi-fi credentials

In 'wifi_credentials.lua', fill the network name and password for the local wi-fi network your application will run on. 

### MQTT Credentials

Give the username and password to connect to your MQTT broker. They must match the credentials you set in the web-application config file.

The machine you run the OpenGrow application on will be acting as a server for the MQTT broker and web-app back-end. Thus, you must provide the IP address of this machine for the ESP to find it on your local network. You must enter this HOST IP address and port running the MQTT broker in the credential file.

To get your machine's IP address simply open a terminal and give the command 'ipconfig'. Look for the IPv4 address.

NOTE: Your machine's IP address can change sometimes if your router assigns a new address. However, you can assign your machine a static IP address through a procedure like [this one](https://www.youtube.com/watch?v=5iRp1Nug0PU&t=30s).

## Flash ESP8266

Download the free [ESPlorer tool](https://esp8266.ru/esplorer/) to save the firmware files to your ESP8266. Launch the program and open serial communication with your ESP8266.

You must save the following files to your ESP8266:

1. device_info.lua
1. mqtt_credentials.lua
1. wifi_credentials.lua
1. stm32_comm.lua
1. init.lua

Please make sure that you flash 'init.lua' only after the previous 4! If you fail to do this, the ESP crashes and gets [stuck in infinite reset.](https://nodemcu.readthedocs.io/en/master/upload/)

## Complete

Your ESP8266 is ready to go. The on-board LED will blink blue when it is connected to your MQTT broker and will be off otherwise.

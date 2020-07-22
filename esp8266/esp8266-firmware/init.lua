-------------------------------------------------------
------------------- Initialization --------------------
-------------------------------------------------------

-- wifi credentials
wifi_creds = require 'credentials'

-- mqtt broker credentials
mqtt_creds = require 'mqtt_credentials'

-- wifi network settings 
station_cfg = {
    ssid = wifi_creds.SSID,
    pwd = wifi_creds.PASSWORD,
    save = true,
    auto = false
}

-- mqtt settings 
mqtt_cfg = {
    clientId = "ESP8266_Client",
    topic = "esp8266_plant",
    qos = 1,
    host = "192.168.0.23",
    port = 1883,
}

mqtt_subTopic = 'ESP8266_test'

-- i2c onfiguration
id  = 0 
sda = 1     -- set pin 1 as sda
scl = 2     -- set pin 2 as scl

stm32_address = 0x68

-- Wait 3 seconds after power-on to enter the main program
tmr.create():alarm(3000, tmr.ALARM_SINGLE, function()
    dofile('main.lua')
end)
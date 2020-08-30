-------------------------------------------------------
------------------- Initialization --------------------
-------------------------------------------------------

-- device info
device_info = require 'device_info'

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
local mqttQoS = 1

mqtt_cfg = {
    clientId = "esp_" .. device_info.ID,
    qos = mqttQoS,
    subTopics = {[device_info.ID .. "/soilMoisture/setpoint"]=mqttQoS, [device_info.ID .. "/soilMoisture/tolerance"]=mqttQoS},
    pubTopics = {soil=device_info.ID .. "/soilMoisture", light=device_info.ID .. "/lightLevel"}
    host = "192.168.0.20",
    port = 1883,
}

-- i2c configuration
i2c_config = {
    id  = 0,
    sda = 1,    -- set pin 1 as sda
    scl = 2     -- set pin 2 as scl
}

STM32_ADDR = 0x68

-- i2c commands to stm32
ESP_REQ_SENSOR_DATA_CMD = 0x51
ESP_SEND_SETPOINT_CMD = 0x44
ESP_SEND_TOLERANCE_CMD = 0x46

i2c.setup(i2c_config.id, i2c_config.sda, i2c_config.scl, i2c.SLOW)   -- initialize i2c

-- Wait 4 seconds after power-on to enter the main program
tmr.create():alarm(4000, tmr.ALARM_SINGLE, function()
    dofile('main.lua')
end)
-------------------------------------------------------
------------------- Initialization --------------------
-------------------------------------------------------

-- device info
device_info = require 'device_info'

-- wifi credentials
wifi_creds = require 'credentials'

-- mqtt broker credentials
mqtt_creds = require 'mqtt_credentials'

-- Blue LED is connected to pin #2
BLUE_LED = 0

-- wifi network settings 
station_cfg = {
    ssid = wifi_creds.SSID,
    pwd = wifi_creds.PASSWORD,
    save = true,
    auto = false
}

-------------------------------------------------------
---------------- I2c Config and Imports ---------------
-------------------------------------------------------
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

i2c.setup(i2c_config.id, i2c_config.sda, i2c_config.scl, i2c.SLOW)

require 'stm32_comm'

-------------------------------------------------------
---------------- Create MQTT Client -------------------
-------------------------------------------------------

-- Mqtt connect configuration
clientId = "esp_" .. device_info.ID
qos = 1
subTopics = {[device_info.ID .. "/soilMoisture/setpoint"]=qos, [device_info.ID .. "/soilMoisture/tolerance"]=qos}
pubTopics = {soil=device_info.ID .. "/soilMoisture", light=device_info.ID .. "/lightLevel"}

-- create mqtt client
client = mqtt.Client(clientId, 120, mqtt_creds.USERNAME, mqtt_creds.PASSWORD)

-------------------------------------------------------
------------ Blinky Timer for Feedback ----------------
-------------------------------------------------------
local blinky_timer = tmr.create()

-- Register auto-repeating 1000 ms (1 sec) timer
blinky_timer:register(1000, tmr.ALARM_AUTO, function()
    -- Invert the state of BLUE_LED pin
    if gpio.read(BLUE_LED) == 1 then
        gpio.write(BLUE_LED, gpio.LOW)
    else
        gpio.write(BLUE_LED, gpio.HIGH)
    end
end)

-------------------------------------------------------
------------------- Wifi Connection -------------------
-------------------------------------------------------
local wifiConn_timer = tmr.create()

-- initialize timer to get ip address and connect to MQTT broker
wifiConn_timer:register(3000, tmr.ALARM_AUTO, function()
    if wifi.sta.getip() == nil then
        print("IP unavailable, Waiting...")
    else
        wifiConn_timer:stop()
        print("ESP8266 mode is: " .. wifi.getmode())
        print("The module MAC address is: " .. wifi.ap.getmac())
        print("Config done, IP is "..wifi.sta.getip())
        
        -- connect to mqtt broker
        mqtt_data_connect()
    end
end)

-- connect to wifi station and start timer to connect to MQTT
wifi.sta.connect(function()
    wifiConn_timer:start()
end)

-------------------------------------------------------
---------- Handling Messages From Web-App -------------
-------------------------------------------------------

-- receive messages from web app
client:on("message", function(client, topic, data)
    _, ind = string.find(data, ":")
    local value = string.sub(data, ind + 2, -3)

    if string.find(topic, "setpoint") ~= nil then
        print("Setpoint update to: " .. tonumber(value))
        i2c_send_update(i2c_config.id, STM32_ADDR, ESP_SEND_SETPOINT_CMD, tonumber(value))
    end
    
    if string.find(topic, "tolerance") ~= nil then
        print("Tolerance update to: " .. tonumber(value))
        i2c_send_update(i2c_config.id, STM32_ADDR, ESP_SEND_TOLERANCE_CMD, tonumber(value))
    end
end)

-------------------------------------------------------
------- Periodically get sensor data from STM32 -------
-------------------------------------------------------
local mqtt_pubData = tmr.create()

-- every 5 min -> Call function to get data from stm32 and then publish to broker
mqtt_pubData:register(60000, tmr.ALARM_AUTO, function()
    local data = i2c_get_data(i2c_config.id, STM32_ADDR, ESP_REQ_SENSOR_DATA_CMD)

    -- sending data in json format
    soilData = '{"highByte": ' .. string.byte(data, 3) .. ', "lowByte": ' .. string.byte(data, 4) .. '}'
    lightData = '{"highByte": ' .. string.byte(data, 1) .. ', "lowByte": ' .. string.byte(data, 2) .. '}'

    -- publish soil and light data
    client:publish(pubTopics.soil, soilData, qos, 0)
    client:publish(pubTopics.light, lightData, qos, 0)
end)

-------------------------------------------------------
-------------- MQTT Broker Connection -----------------
-------------------------------------------------------

-- handle mqtt connection error by trying reconnection
function handle_mqtt_conn_error()
    print ('Mqtt connection error')
    mqtt_pubData:stop()

    -- stop the LED blinking and turn off the LED
    blinky_timer:stop()
    gpio.write(BLUE_LED, gpio.HIGH)

    -- Try reconnecting every 5 seconds
    tmr.create():alarm(5000, tmr.ALARM_SINGLE, mqtt_data_connect)
end

-- connect to the mqtt broker
function mqtt_data_connect()
    client:connect(mqtt_creds.HOST, mqtt_creds.PORT, false, 
        function() 
            print('Mqtt broker connected') 

            -- subscribe to topic
            client:subscribe(subTopics, function() print('ESP8266 subscribed') end)

            -- start timer to publish data every 15 seconds
            mqtt_pubData:start()

            -- Start blinky timer
            blinky_timer:start()

            -- if go offline, call connection error
            client:on("offline", handle_mqtt_conn_error)
        end, 
        handle_mqtt_conn_error)
end


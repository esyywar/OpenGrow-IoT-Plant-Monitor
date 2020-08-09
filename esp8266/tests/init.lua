-- import wifi credentials
local wifi_creds = require 'credentials'

--import device info
local device_info = require 'device_info'

-- import mqtt credentials
local mqtt_creds = require 'mqtt_credentials'

-- Print some welcome message
print('Hello from init.lua file!')

-- Blue LED is connected to pin #2
local BLUE_LED = 0

-- Configure BLUE_LED pin
gpio.mode(BLUE_LED, gpio.OUTPUT, gpio.FLOAT)

-- Turn off LED on startup
gpio.write(BLUE_LED, gpio.HIGH)

-- configure connection to wifi network
station_cfg = {}
station_cfg.ssid = wifi_creds.SSID
station_cfg.pwd = wifi_creds.PASSWORD
station_cfg.save = true
station_cfg.auto = false

id  = 0 -- always 0
sda = 1 -- set pin 1 as sda
scl = 2 -- set pin 2 as scl

stm32_address = 0x68

i2c.setup(id, sda, scl, i2c.SLOW)   -- initialize i2c

-- Mqtt connect configuration
local clientId = "esp_" .. device_info.ID
local subTopic = device_info.ID .. "/update"
local pubTopics = {soil=device_info.ID .. "/soilMoisture", light=device_info.ID .. "/lightLevel"}
local qos = 1
local mqtt_host = '192.168.0.25'
local mqtt_port = 1883

-- create mqtt client
client = mqtt.Client(clientId, 120, mqtt_creds.USERNAME, mqtt_creds.PASSWORD)

-- Create a blinky timer
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

-- timer to post network info when available
local netinfo_timer = tmr.create()

netinfo_timer:register(3000, tmr.ALARM_AUTO, function()
        if wifi.sta.getip() == nil then
            print("IP unavailable, Waiting...")
        else
            netinfo_timer:stop()
            print("ESP8266 mode is: " .. wifi.getmode())
            print("The module MAC address is: " .. wifi.ap.getmac())
            print("Config done, IP is "..wifi.sta.getip())

            -- connect to mqtt broker
            mqtt_data_connect()
        end
    end
)

-- connect to wifi station and start timer to post network info
wifi.sta.connect(function() 
    netinfo_timer:start()
end)

-- timer to publish messages every 15 sec
local mqtt_pubData = tmr.create()

mqtt_pubData:register(300000, tmr.ALARM_AUTO, function()
    local data = i2c_get_data()

    -- sending data in json format
    soilData = '{"highByte": ' .. string.byte(data, 3) .. ', "lowByte": ' .. string.byte(data, 4) .. '}'
    lightData = '{"highByte": ' .. string.byte(data, 1) .. ', "lowByte": ' .. string.byte(data, 2) .. '}'

    -- publish soil and light data
    client:publish(pubTopics.soil, soilData, qos, 0)
    client:publish(pubTopics.light, lightData, qos, 0)
end)

-- handle mqtt connection error by trying reconnection
function handle_mqtt_conn_error()
    print ('Mqtt connection error')
    mqtt_pubData:stop()
    blinky_timer:stop()
    tmr.create():alarm(5000, tmr.ALARM_SINGLE, mqtt_data_connect)
end

-- connect to the mqtt broker
function mqtt_data_connect()
    client:connect(mqtt_host, mqtt_port, false, 
        function() 
            print('Mqtt broker connected') 

            -- subscribe to topic
            client:subscribe(subTopic, qos, function() print('ESP8266 subscribed') end)

            -- start timer to publish data every 15 seconds
            mqtt_pubData:start()

            -- Start blinky timer
            blinky_timer:start()

            -- if go offline, call connection error
            client:on("offline", handle_mqtt_conn_error)
        end, 
        handle_mqtt_conn_error)
end

-- Call this function to get sensor data from stm32
function i2c_get_data()
    i2c.start(id)       -- send start condition

    if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then   -- set slave address and transmit direction
        i2c.write(id, 0x51)  
        i2c.stop(id)   

        -- get 4 bytes of sensor data
        i2c.start(id)
        if (i2c.address(id, stm32_address, i2c.RECEIVER)) then
            data = i2c.read(id, 4)
            i2c.stop(id)

            data = string.reverse(data)

            return data
        end
    else
        print('STM32 Not responding..!')
    end

    return 0
end


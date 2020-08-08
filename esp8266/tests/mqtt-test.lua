-- import wifi credentials
local wifi_creds = require 'credentials'

-- configure connection to wifi network
station_cfg = {}
station_cfg.ssid = wifi_creds.SSID
station_cfg.pwd = wifi_creds.PASSWORD
station_cfg.save = true
station_cfg.auto = false

-- set wifi mode
wifi.setmode(wifi.STATION, true)
wifi.sta.config(station_cfg)

--import device info
local device_info = require 'device_info'

-- import mqtt credentials
local mqtt_creds = require 'mqtt_credentials'

-- Mqtt connect configuration
local clientId = "esp_" .. device_info.ID
local subTopic = device_info.ID .. "/update"
local pubTopics = device_info.ID .. "/soilMoisture"
local qos = 1
local mqtt_host = '192.168.0.25'
local mqtt_port = 1883

-- create mqtt client
client = mqtt.Client(clientId, 120, mqtt_creds.USERNAME, mqtt_creds.PASSWORD)

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
    end
)

-- timer to publish messages every 15 sec
local mqtt_pubData = tmr.create()

mqtt_pubData:register(15000, tmr.ALARM_AUTO, function()
    data = '{"highByte": 6, "lowByte": 160}'

    client:publish(pubTopic, data, qos, 0, function()
            print('Published data ack\'d')
    end)
end
)

-- handle mqtt connection error by trying reconnection
function handle_mqtt_conn_error()
    print ('Mqtt connection error')
    mqtt_pubData:stop()
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

            -- if go offline, call connection error
            client:on("offline", handle_mqtt_conn_error)
        end, 
        handle_mqtt_conn_error)
end






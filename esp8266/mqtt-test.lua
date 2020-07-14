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

-- create mqtt client
client = mqtt.Client("ESP8266_Client", 120, "plantMonitorBroker96", "securePassword123")

-- Mqtt connect configuration
local topic = 'esp8266_plant'
local qos = 1
local mqtt_host = '192.168.0.23'
local mqtt_port = 1883

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

-- handle mqtt connection error by trying reconnection
function handle_mqtt_conn_error()
    print ('Mqtt connection error')
    tmr.create():alarm(5000, tmr.ALARM_SINGLE, mqtt_data_connect)
end

-- connect to the mqtt broker
function mqtt_data_connect()
    client:connect(mqtt_host, mqtt_port, false, 
        function() 
            print('Mqtt broker connected') 

            -- subscribe to topic
            client:subscribe(topic, qos, function() print('ESP8266 subscribed') end)
        end, 
        handle_mqtt_conn_error)
end

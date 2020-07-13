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

-- connect to wifi station and print success message
wifi.sta.connect(function() print('Connection established!') end)

-- create local timer
local timer = tmr.create()

timer:alarm(3000, tmr.ALARM_AUTO, function()
        if wifi.sta.getip() == nil then
            print("IP unavailable, Waiting...")
        else
            timer:stop()
            print("ESP8266 mode is: " .. wifi.getmode())
            print("The module MAC address is: " .. wifi.ap.getmac())
            print("Config done, IP is "..wifi.sta.getip())
        end
    end
)
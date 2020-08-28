-- import wifi credentials
local wifi_creds = require 'credentials'

--import device info
local device_info = require 'device_info'

-- configure connection to wifi network
station_cfg = {}
station_cfg.ssid = wifi_creds.SSID
station_cfg.pwd = wifi_creds.PASSWORD
station_cfg.save = true
station_cfg.auto = false

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
            get_control_data()
        end
    end
)

-- connect to wifi station and start timer to post network info
wifi.sta.connect(function() 
    netinfo_timer:start()
end)

-- Send http request to back end to get plant's control points data
function get_control_data()
    http.get('http://192.168.0.20:5000/api/plant/control/' .. device_info.ID, nil, function(code, data)
        setStart, setFin = string.find(data, "setpoint")
        tolStart, tolFin = string.find(data, "tolerance")

        local setpoint = string.sub(data, setFin + 3, tolStart - 3)
        local tolerance = string.sub(data, tolFin + 3, -4)

        print(setpoint)
        print(tolerance)
    end)
end

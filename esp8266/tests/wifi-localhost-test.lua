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

-- Try get request from program runing at localhost 0.0.0.0:3000
function http_get_localhost()
    http.get('http://192.168.0.23:3000', nil, function(status_code, data) 
            if (status_code < 0) then
                print('HTTP request failed...')
            else
                print(data)
            end
        end
    )
end

-- timer to post network info when available
local timer = tmr.create()

timer:register(3000, tmr.ALARM_AUTO, function()
        if wifi.sta.getip() == nil then
            print("IP unavailable, Waiting...")
        else
            timer:stop()
            print("ESP8266 mode is: " .. wifi.getmode())
            print("The module MAC address is: " .. wifi.ap.getmac())
            print("Config done, IP is "..wifi.sta.getip())

            http_get_localhost()
        end
    end
)

-- connect to wifi station and print success message with wifi inf0
wifi.sta.connect(function() 
        timer:start()
    end
)



 

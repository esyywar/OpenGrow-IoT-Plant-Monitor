-------------------------------------------------------
------- Periodically get sensor data from STM32 -------
-------------------------------------------------------

dataPub_timer = tmr.create()

-- every 5 min -> Call function to get data from stm32 and then publish to broker
dataPub_timer:register(300000, tmr.ALARM_AUTO, function()
    -- call function to get data from stm32
end)

-------------------------------------------------------
-------------- MQTT Broker Connection -----------------
-------------------------------------------------------

-- create mqtt client
client = mqtt.Client(clientId, 120, mqtt_creds.USERNAME, mqtt_creds.PASSWORD)

-- on mqtt connection error -> wait 5 seconds and try reconnect
function handle_mqtt_conn_error()
    tmr.create():alarm(5000, tmr.ALARM_SINGLE, mqtt_data_connect)
end

function mqtt_data_connect()
    -- last will and testament
    client:lwt(mqtt_subTopic, 'Going offline')

    client:connect(mqtt_cfg.host, mqtt_cfg.port, false, function()
        client:subscribe(mqtt_subTopic, mqtt_cfg.qos)

        -- get message for new setpoints
        client:on('message', function(client, topic, payload)
            -- TODO call function to send data to STM32
        end)

        -- TODO start timer for writing data to broker
    end, handle_mqtt_conn_error)
end

-------------------------------------------------------
------------------- Wifi Connection -------------------
-------------------------------------------------------

wifiConn_timer = tmr.create()

-- initialize timer to get ip address and connect to MQTT broker
wifiConn_timer:register(3000, tmr.ALARM_AUTO, function()
    if wifi.sta.getip() ~= nil then
        wifiConn_timer:stop()

        -- connect to mqtt broker
        mqtt_data_connect()
    end
end)

-- connect to wifi station and start timer to connect to MQTT
wifi.sta.connect(function() 
    netinfo_timer:start()
end)


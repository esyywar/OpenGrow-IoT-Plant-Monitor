-------------------------------------------------------
--------- Import I2C communication functions ----------
-------------------------------------------------------
require 'stm32_comm'

-------------------------------------------------------
---------------- Create MQTT Clieht -------------------
-------------------------------------------------------
client = mqtt.Client(clientId, 120, mqtt_creds.USERNAME, mqtt_creds.PASSWORD)

-------------------------------------------------------
------- Periodically get sensor data from STM32 -------
-------------------------------------------------------
dataPub_timer = tmr.create()

-- every 5 min -> Call function to get data from stm32 and then publish to broker
dataPub_timer:register(300000, tmr.ALARM_AUTO, function()
    -- call function to get 32 bits of data from stm32
    local sensorData = stm32_get_data(i2c_config.id, STM32_ADDR, ESP_REQ_SENSOR_DATA_CMD)

    -- Publish data through broker with retain flag set
    client:publish(mqtt_cfg.pubTopic, sensorData, mqtt_cfg.qos, 1)
end)

-------------------------------------------------------
-------------- MQTT Broker Connection -----------------
-------------------------------------------------------
-- on mqtt connection error -> wait 5 seconds and try reconnect
function handle_mqtt_conn_error()
    -- stop the data comm and publishing
    dataPub_timer:stop()

    tmr.create():alarm(5000, tmr.ALARM_SINGLE, mqtt_data_connect)
end

function mqtt_data_connect()
    -- last will and testament
    client:lwt(mqtt_subTopic, 'Going offline')

    client:connect(mqtt_cfg.host, mqtt_cfg.port, false, function()
        client:subscribe(mqtt_cfg.subTopic, mqtt_cfg.qos)

        -- get message for new soil moisture setpoint/tolerance range
        client:on('message', function(client, topic, payload)
            -- TODO run tests to see received data from web app... need to parse 
            -- data here and determine which command to send stm32....

            -- To send updated setpoint
            stm32_update_control(mqtt_cfg.id, STM32_ADDR, ESP_SEND_SETPOINT_CMD, payload.setpoint)

            -- To send updated tolerance value
            stm32_update_control(mqtt_cfg.id, STM32_ADDR, ESP_SEND_TOLERANCE_CMD, payload.tolerance)
        end)

        -- start timer for getting data from stm32 and publishing to broker
        dataPub_timer:start()
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
    wifiConn_timer:start()
end)


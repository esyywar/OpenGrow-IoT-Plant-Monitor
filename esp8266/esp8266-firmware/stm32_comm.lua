-- This function will get sensor data from stm32
function i2c_get_data(id, stm32_address, command)
    i2c.start(id)       -- send start condition

    if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then   -- set slave address and transmit direction
        i2c.write(id, command)  
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

    -- return -1 in case of error
    return -1
end

-- This function will first send command and then updated control data to stm32
function i2c_send_update(id, stm32_address, command, value)
    -- break the value into high and low bytes
    local highByte = bit.rshift(bit.band(value, 0xFF00), 8)
    local lowByte = bit.band(value, 0xFF)
    print(highByte)
    print(lowByte)

    i2c.start(id)       -- send start condition

    if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then   -- set slave address and transmit direction
        i2c.write(id, command)      -- command tells stm32 if we are sending setpoint or tolerance update
        i2c.stop(id)

        -- send the update value
        i2c.start(id)
        if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then

            i2c.write(id, lowByte)     -- low byte in stm32
            i2c.write(id, highByte)     -- high byte in stm32
            i2c.stop(id)
        end

        -- return 0 if executed properly
        return 0
    end

    -- return -1 in case of error
    return -1
end




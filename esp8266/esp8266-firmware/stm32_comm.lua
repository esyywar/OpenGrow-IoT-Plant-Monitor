-- Get soil moisture and light level data from the plant
-- Data packet is 4 bytes -> top 16 bits is soil moisture, bottom 16 bit is light level
-- Return: 32 bits of data, 1 in case of error
function stm32_get_data(id, stm32_address, data_command)
    -- send the start bit
    i2c.start(id)

    local data

    -- send slave address and proceed if ACK
    if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then
        i2c.write(id, data_command)
        i2c.stop(id)

        -- get the data
        i2c.start(id)
        if (i2c.address(id, stm32_address, i2c.RECEIVER)) then
            data = i2c.read(id, 4)
            i2c.stop(id)
        else 
            return 1
        end 
    else
        return 1
    end

    return data
end

-- Update control points for plant (soil moisture setpoint or tolerance)
-- Data packet is 16 bit data value
-- Return: 0 is successfully sent, 1 in case of error
function stm32_update_control(id, stm32_address, data_command, data_value)
    -- send the start bit
    i2c.start(id)

    -- send slave address and proceed if ACK
    if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then
        i2c.write(id, data_command)
        i2c.stop(id)

        --send the updated setpoint value
        i2c.start(id)
        if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then
            i2c.write(id, data_value)
            i2c.stop(id)
        else 
            return 1
        end 
    else
        return 1
    end

    return 0
end




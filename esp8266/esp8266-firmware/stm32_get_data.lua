function stm32_get_data(id, stm32_address)
end

i2c.start(id)       -- send start condition

if (i2c.address(id, arduino_address, i2c.TRANSMITTER)) then   -- set slave address and transmit direction
    print('got ack')
    i2c.write(id, 0x51)  
    i2c.stop(id)   

    -- get length of message
    i2c.start(id)
    if (i2c.address(id, arduino_address, i2c.RECEIVER)) then
        print('got len ack')
        len = i2c.read(id, 1)
        i2c.stop(id)
        print('Msg length: ', string.byte(len))
    end

    -- send cmd to get message
    i2c.start(id)
    if (i2c.address(id, arduino_address, i2c.TRANSMITTER)) then
        print('got third ack')
        i2c.write(id, 0x52)  -- write string to slave arduino
        i2c.stop(id)    -- send stop condition
    end

    i2c.start(id)
    if (i2c.address(id, arduino_address, i2c.RECEIVER)) then
        print('got fourth ack')
        msg = i2c.read(id, string.byte(len))
        i2c.stop(id)
        print(msg)
    end
        
else
    print('STM32 Not responding..!')
end

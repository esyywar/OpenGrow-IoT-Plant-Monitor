id  = 0 -- always 0
sda = 1 -- set pin 1 as sda
scl = 2 -- set pin 2 as scl

arduino_address = 0x68

i2c.setup(id, sda, scl, i2c.SLOW)   -- initialize i2c

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

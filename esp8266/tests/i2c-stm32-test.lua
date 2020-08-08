id  = 0 -- always 0
sda = 1 -- set pin 1 as sda
scl = 2 -- set pin 2 as scl

stm32_address = 0x68

i2c.setup(id, sda, scl, i2c.SLOW)   -- initialize i2c

i2c.start(id)       -- send start condition

if (i2c.address(id, stm32_address, i2c.TRANSMITTER)) then   -- set slave address and transmit direction
    print('got ack')
    i2c.write(id, 0x51)  
    i2c.stop(id)   

    -- get 4 bytes of sensor data
    i2c.start(id)
    if (i2c.address(id, stm32_address, i2c.RECEIVER)) then
        print('got data ack')
        data = i2c.read(id, 4)
        i2c.stop(id)

        -- reverse to data buffer is MSB first
        data = string.reverse(data)
        print('soilMoisture: ', string.byte(data, 3), string.byte(data, 4), ' lightLevel: ', string.byte(data, 1, 2))
    end
else
    print('STM32 Not responding..!')
end

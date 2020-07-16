-- stm slave address
local STM32_ADDR = 0x6D

-- commands to get data from stm
local STR_LEN_CMD = 0x5C
local STR_SEND_CMD = 0x5E

-- i2c configurations
i2c0 = {
    id = 0,
    sda = 2,            -- GPIO4
    scl = 1,            -- GPIO5
    speed = i2c.SLOW
}

-- set up i2c
local isSpeed = i2c.setup(i2c0.id, i2c0.sda, i2c0.scl, i2c0.speed)

-- if initialization success...
if (isSpeed == i2c0.speed) then 
    local len = i2c_getLen(i2c0.id, STM32_ADDR)
    print('Got msg length: ' ... len)

    local msg = i2c_getData(i2c0.id, STM32_ADDR, len)
    print('Got msg: ' ... msg)
end

-- get length of string to be sent
function i2c_getLen(id, addr) 
    print('Getting msg length...')
    i2c.start(id)

    -- If received ack, carry on...
    if (i2c.address(id, dev_addr, i2c.TRANSMITTER)) then
        i2c.write(id, STR_LEN_CMD)
    else
        print('No ack...')
        i2c.stop()
        return
    end  

    i2c.stop()

    i2c.start(id)
    i2c.address(id, dev_addr, i2c.RECEIVER)
    local len = i2c.read(id, 1)

    return len
end

-- get data of given length from slave
function i2c_getData(id, addr, len)
    print('Getting msg...')
    i2c.start(id)

    -- If received ack, carry on...
    if (i2c.address(id, dev_addr, i2c.TRANSMITTER)) then
        i2c.write(id, STR_SEND_CMD)
    else
        print('No ack...')
        i2c.stop()
        return
    end  

    i2c.stop()

    i2c.start(id)
    i2c.address(id, dev_addr, i2c.RECEIVER)
    local msg = i2c.read(id, len)

    return msg
end
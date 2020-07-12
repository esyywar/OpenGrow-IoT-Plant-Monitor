-- Print some welcome message
print('Hello from init.lua file!')

-- Blue LED is connected to pin #2
local BLUE_LED = 0

-- Configure BLUE_LED pin
gpio.mode(BLUE_LED, gpio.OUTPUT, gpio.FLOAT)

-- Turn off LED on startup
gpio.write(BLUE_LED, gpio.LOW)

-- Create a timer
local timer = tmr.create()

-- Register auto-repeating 1000 ms (1 sec) timer
timer:register(1000, tmr.ALARM_AUTO, function()
    -- Invert the state of BLUE_LED pin
    if gpio.read(BLUE_LED) == 1 then
        gpio.write(BLUE_LED, gpio.LOW)
    else
        gpio.write(BLUE_LED, gpio.HIGH)
    end
end)

-- Start timer
timer:start()

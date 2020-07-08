light=0
pin=4
gpio.mode(pin,gpio.OUTPUT)

tmr.create():alarm(5000, tmr.ALARM_AUTO, function()
        if light==0 then
            light=1
            gpio.write(pin,gpio.HIGH)
        else
            light=0
            gpio.write(pin,gpio.LOW)
            io.write('Light OFF')
        end
    end
)

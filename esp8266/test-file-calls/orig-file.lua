require 'print-msg'

print('entered first file')

i = 0

fileTest_timer = tmr.create()

fileTest_timer:register(4000, tmr.ALARM_AUTO , function()
    i = i + 1
    printMsg()

    local sum = addNumbers(3, 4)
    print('The sum is ', sum)

    if (i == 5) then
        fileTest_timer:stop()
    end
end)

fileTest_timer:start()

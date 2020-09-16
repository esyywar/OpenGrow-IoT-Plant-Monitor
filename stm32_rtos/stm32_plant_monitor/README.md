## STM32 Firmware Description

The STM32 firmware runs a real-time application built on the FreeRTOS kernel. 

The STM32F4 HAL (hardware abstraction layer) API is also used.

There are separate tasks used for: write operations to the OLED display, reading data values from sensors and watering the plant according to a PID controller formula.

## STM32CubeIDE

The project is this repo is built with the STM32CubeIDE development platform. This SDK is ST's adaptation of the popular open-source Eclipse IDE. 

STM32CubeIDE is simply a free Eclipse based platform where the GCC toolchain, GDB debugger and other configurations are set for compatibilty with STM32 processors. This saves time and effort for the developed in setting up the environment.

To open the project in this repo and flash the firmware to your STM32F4 device, first [download the STM32Cube IDE](https://www.st.com/en/development-tools/stm32cubeide.html).

## Flashing STM32 Firmware

To open the project with STM32CubeIDE, you should open the '.cproject' file in this folder. A window will pop up asking to set the project workspace. You should choose the 'stm32_rtos' folder as this directory.

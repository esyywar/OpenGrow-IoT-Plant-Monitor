/**
 * original author:  Tilen Majerle<tilen@majerle.eu>
 * modification for STM32f10x: Alexander Lutsai<s.lyra@ya.ru>

   ----------------------------------------------------------------------
   	Copyright (C) Alexander Lutsai, 2016
    Copyright (C) Tilen Majerle, 2015
		
		Modified by: Rahul Eswar, 2020
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.
     
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
   ----------------------------------------------------------------------
 */
#ifndef SSD1306_H
#define SSD1306_H 100

/* C++ detection */
#ifdef __cplusplus
extern C {
#endif
 
 /**
 * Library for SSD1306 driver with SPI communication
 *
 * Library features functions for drawing lines, rectangles and circles.
 *
 * It also allows you to draw texts and characters using appropriate functions provided in library.
 *
 * Default pinout
 *
 * SSD1306    |STM32F10x    |DESCRIPTION
 *
 * VCC        |3.3V         |
 * GND        |GND          |
 * SCK        |PA5          |Serial clock line
 * MOSI       |PA7          |Data line (stm32 -> SSD1306)
 * CS         |PA4          |Chip select (active low)
 * D/C        |PC8          |Data/Command buffer access select
 * VDDC       |PC6          |Power to OLED logic - active low
 * VBATC      |PC5          |Power to OLED display - active low
 */

#include "stm32f4xx_hal.h"
#include "stm32f4xx_hal_gpio.h"
#include "stm32f4xx_hal_spi.h"

#include "fonts.h"

#include "stdlib.h"
#include "string.h"


/*******************************************************
********** SSD1306 settings
*******************************************************/

/* SSD1306 width in pixels */
#ifndef SSD1306_WIDTH
#define SSD1306_WIDTH            				128
#endif

/* SSD1306 LCD height in pixels */
#ifndef SSD1306_HEIGHT
#define SSD1306_HEIGHT           				32
#endif

/* Pixel colours */
#define SSD1306_PX_CLR_BLACK						0
#define SSD1306_PX_CLR_WHITE						1


/*******************************************************
********** Digilent PMOS OLED VBATC, VDDC Controls
*******************************************************/

/*
* D/C -------- GPIO Port C, Pin 8
* VDDC ------- GPIO Port C, Pin 6
* VBATC ------ GPIO Port C, Pin 5
*/

/* Must toggle to access OLED command or data buffer */
#define SSD1306_CMD_ACCESS()						HAL_GPIO_WritePin(GPIOC, GPIO_PIN_8, GPIO_PIN_RESET)
#define SSD1306_DISP_ACCESS()						HAL_GPIO_WritePin(GPIOC, GPIO_PIN_8, GPIO_PIN_SET)

/* Toggling power to the logic of OLED */
#define SSD1306_LOGIC_POWER_EN()				HAL_GPIO_WritePin(GPIOC, GPIO_PIN_6, GPIO_PIN_RESET)
#define SSD1306_LOGIC_POWER_DI()				HAL_GPIO_WritePin(GPIOC, GPIO_PIN_6, GPIO_PIN_SET)

/* Toggling power to display of OLED */
#define SSD1306_DISP_POWER_EN()					HAL_GPIO_WritePin(GPIOC, GPIO_PIN_5, GPIO_PIN_RESET)
#define SSD1306_DISP_POWER_DI()					HAL_GPIO_WritePin(GPIOC, GPIO_PIN_5, GPIO_PIN_SET)


/*******************************************************
********** SSD1306 Command Macros
*******************************************************/

/*
* Fundamental commands
*/
#define SSD1306_DISABLE									0
#define SSD1306_ENABLE									1

#define SSD1306_INIT_FAILED							0
#define SSD1306_INIT_SUCCESS						1

#define SSD1306_CMD_CONTRAST_CTRL				0x81
#define SSD1306_CMD_UPDATE							0xA4
#define SSD1306_CMD_ALL_ON							0xA5
#define SSD1306_CMD_NORM_DISP						0xA6
#define SSD1306_CMD_INVERT_DISP					0xA7
#define SSD1306_CMD_DISP_ON							0xAF
#define SSD1306_CMD_DISP_OFF						0xAE

/*
* Charge pump (transform 7/5 V for display) 
*/
#define SSD1306_CMD_CHRG_PUMP_SET				0x8D
#define SSD1306_CMD_CHRG_PUMP_EN				0x14
#define SSD1306_CMD_CHRG_PUMP_DI				0x10

/* 
* Addressing mode 
*/
#define SSD1306_CMD_ADDR_MODE_PAGE			0x10
#define SSD1306_CMD_ADDR_MODE_HORZ			0x00
#define SSD1306_CMD_ADDR_MODE_VERT			0x01

/* 
* Hardware configurations 
*/
#define SSD1306_CMD_ADDR_MODE_SET				0x20
#define SSD1306_CMD_START_LINE					0x40
#define SSD1306_CMD_SEG_REMAP						0xA0
#define SSD1306_CMD_COM_SCAN_DIR				0xC0
#define SSD1306_CMD_MUX_RATIO_SET				0xA8
#define SSD1306_CMD_DISP_OFFSET_SET			0xD3
#define SSD1306_COM_HW_CONFIG_SET				0xDA

/*
* Clock configuration
*/
#define SSD1306_CLK_SET									0xD5
#define SSD1306_CLK_CHRG_PRD_SET				0xD9

/*
* Power management 
*/
#define SSD1306_CLK_VCOM_SET						0xDB


/*******************************************************
********** SSD1306 Command Macros
*******************************************************/

#define SSD1306_DEACTIVATE_SCROLL                    	0x2E
#define SSD1306_ACTIVATE_SCROLL                      	0x2F

#define SSD1306_RIGHT_HORIZONTAL_SCROLL              	0x26
#define SSD1306_LEFT_HORIZONTAL_SCROLL               	0x27
#define SSD1306_VERTICAL_AND_RIGHT_HORIZONTAL_SCROLL 	0x29
#define SSD1306_VERTICAL_AND_LEFT_HORIZONTAL_SCROLL  	0x2A
#define SSD1306_SET_VERTICAL_SCROLL_AREA             	0xA3


/*******************************************************
********** SSD1306 Config Macros (User set)
*******************************************************/

/*
* Hardware configurations
*/
#define SSD1306_CONTRAST_VALUE					0x7F
#define SSD1306_MUX_RATIO_VALUE					0x3F
#define SSD1306_DISP_OFFSET_VALUE				0x00
#define SSD1306_COM_HW_CONFIG_VALUE			0x12

/*
* Clock configuration
*/
#define SSD1306_CLK_MAX									0xF0
#define SSD1306_CLK_CHRG_PRD_VALUE			0x22

/*
* Power management
*/
#define SSD1306_CLK_VCOM_VALUE					0x20


/* I2C address */
#ifndef SSD1306_I2C_ADDR
#define SSD1306_I2C_ADDR         				0x78
#endif


/*******************************************************
********** SSD1306 Config Structures
*******************************************************/

/**
 * @brief  SSD1306 color enumeration
 */
typedef enum {
	SSD1306_COLOR_BLACK = 0x00, /*!< Black color, no pixel */
	SSD1306_COLOR_WHITE = 0x01  /*!< Pixel is set. Color depends on LCD */
} SSD1306_COLOR_t;

/* Private SSD1306 structure */
typedef struct {
	uint16_t CurrentX;
	uint16_t CurrentY;
	uint8_t Inverted;
	uint8_t Initialized;
	uint8_t state;
} SSD1306_t;

/* State macros - set when data from buffer is being loaded */
#define SSD1306_STATE_READY					0
#define SSD1306_STATE_BUSY					1


/**********************************************************
********** SSD1306 Driver Functions API - Display Ctrl
**********************************************************/

/**
 * @brief  Initializes SSD1306 OLED
 * @param  None
 * @retval Initialization status:
 *           - 0: OLED was not detected on I2C port
 *           - > 0: OLED initialized OK and ready to use
 */
uint8_t SSD1306_Init(void);

/** 
 * @brief  Updates buffer from internal RAM to OLED
 * @note   This function must be called each time you do some changes to OLED, to update buffer from RAM to OLED
 */
void SSD1306_UpdateScreen(void);

/** 
 * @brief  Clears the screen
 */
void SSD1306_Clear (void);

/**
 * @brief  Toggles pixels invertion inside internal RAM
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 */
void SSD1306_ToggleInvert(void);

/** 
 * @brief  Fills entire LCD with desired color
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  Color: Color to be used for screen fill. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_Fill(SSD1306_COLOR_t Color);

/**
 * @brief  Writes pixel value to the data buffer - configured to work with SSD1306 in horizontal or page addressing mode
 * @note   @ref SSD1306_UpdateScreen() must called after that in order to see updated LCD screen
 * @param  x: X location. This parameter can be a value between 0 and SSD1306_WIDTH - 1
 * @param  y: Y location. This parameter can be a value between 0 and SSD1306_HEIGHT - 1
 * @param  color: Color to be used for screen fill. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawPixel(uint16_t x, uint16_t y, SSD1306_COLOR_t color);

/**
 * @brief  Sets cursor pointer to desired location for strings
 * @param  x: X location. This parameter can be a value between 0 and SSD1306_WIDTH - 1
 * @param  y: Y location. This parameter can be a value between 0 and SSD1306_HEIGHT - 1
 */
void SSD1306_GotoXY(uint16_t x, uint16_t y);

/**
 * @brief  Puts character to internal RAM
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  ch: Character to be written
 * @param  *Font: Pointer to @ref FontDef_t structure with used font
 * @param  color: Color used for drawing. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 * @retval Character written
 */
char SSD1306_Putc(char ch, FontDef_t* Font, SSD1306_COLOR_t color);

/**
 * @brief  Puts string to internal RAM
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  *str: String to be written
 * @param  *Font: Pointer to @ref FontDef_t structure with used font
 * @param  color: Color used for drawing. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 * @retval Zero on success or character value when function failed
 */
char SSD1306_Puts(char* str, FontDef_t* Font, SSD1306_COLOR_t color);

/**
 * @brief  Draws line on LCD
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x0: Line X start point. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y0: Line Y start point. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x1: Line X end point. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y1: Line Y end point. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 * @retval None
 */
void SSD1306_DrawLine(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, SSD1306_COLOR_t c);

/**
 * @brief  Draws rectangle on OLED
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: Top left X start point. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Top left Y start point. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  w: Rectangle width in units of pixels
 * @param  h: Rectangle height in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawRectangle(uint16_t x, uint16_t y, uint16_t w, uint16_t h, SSD1306_COLOR_t c);

/**
 * @brief  Draws filled rectangle on OLED
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: Top left X start point. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Top left Y start point. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  w: Rectangle width in units of pixels
 * @param  h: Rectangle height in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 * @retval None
 */
void SSD1306_DrawFilledRectangle(uint16_t x, uint16_t y, uint16_t w, uint16_t h, SSD1306_COLOR_t c);

/**
 * @brief  Draws triangle on OLED
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x1: First coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y1: First coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x2: Second coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y2: Second coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x3: Third coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y3: Third coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawTriangle(uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2, uint16_t x3, uint16_t y3, SSD1306_COLOR_t color);

/**
 * @brief  Draws filled triangle on OLED
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x1: First coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y1: First coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x2: Second coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y2: Second coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x3: Third coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y3: Third coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawFilledTriangle(uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2, uint16_t x3, uint16_t y3, SSD1306_COLOR_t color);

/**
 * @brief  Draws circle to STM buffer
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: X location for center of circle. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Y location for center of circle. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  r: Circle radius in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawCircle(int16_t x0, int16_t y0, int16_t r, SSD1306_COLOR_t c);

/**
 * @brief  Draws filled circle to STM buffer
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: X location for center of circle. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Y location for center of circle. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  r: Circle radius in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawFilledCircle(int16_t x0, int16_t y0, int16_t r, SSD1306_COLOR_t c);



#ifndef ssd1306_I2C_TIMEOUT
#define ssd1306_I2C_TIMEOUT					20000
#endif


/*************************************************************
****** SSD1306 Driver Functions API - Data Communication
**************************************************************/

/**
 * @brief  Initializes SSD1306 LCD
 * @retval Initialization status:
 *           - 0: LCD was not detected on I2C port
 *           - > 0: LCD initialized OK and ready to use
 */
void ssd1306_I2C_Init(void);

/**
 * @brief  Writes single byte to slave
 * @param  *I2Cx: I2C used
 * @param  address: 7 bit slave address, left aligned, bits 7:1 are used, LSB bit is not used
 * @param  reg: register to write to
 * @param  data: data to be written
 */
void ssd1306_I2C_Write(uint8_t address, uint8_t reg, uint8_t data);

/**
 * @brief  Writes multi bytes to slave
 * @param  *I2Cx: I2C used
 * @param  address: 7 bit slave address, left aligned, bits 7:1 are used, LSB bit is not used
 * @param  reg: register to write to
 * @param  *data: pointer to data array to write it to slave
 * @param  count: how many bytes will be written
 */
void ssd1306_I2C_WriteMulti(uint8_t address, uint8_t reg, uint8_t *data, uint16_t count);

/**
 * @brief  Writes a 8-bit command to the ssd1306 - this function blocks while sending data
 * @param  uint8_t* pTxBuffer - pointer to the data buffer
 * @param  uint8_t len - length of data to be sent
 */
void ssd1306_SPI_WriteCmd(uint8_t command);

/**
 * @brief  Fills the display data buffer with new screen using DMA to transfer (length is size of SSD1306 buffer defined in ssd1306.c)
 * @param  uint8_t* pTxBuffer - pointer to the data buffer
 */
uint8_t ssd1306_SPI_WriteDisp(uint8_t* pTxBuffer);


/**
 * @brief  Draws the Bitmap
 * @param  X:  X location to start the Drawing
 * @param  Y:  Y location to start the Drawing
 * @param  *bitmap : Pointer to the bitmap
 * @param  W : width of the image
 * @param  H : Height of the image
 * @param  color : 1-> white/blue, 0-> black
 */
void SSD1306_DrawBitmap(int16_t x, int16_t y, const unsigned char* bitmap, int16_t w, int16_t h, SSD1306_COLOR_t color);


/*************************************************************
****** SSD1306 Driver Functions API - Scrolling functions
**************************************************************/

void SSD1306_ScrollRight(uint8_t start_row, uint8_t end_row);

void SSD1306_ScrollLeft(uint8_t start_row, uint8_t end_row);

void SSD1306_Scrolldiagright(uint8_t start_row, uint8_t end_row);

void SSD1306_Scrolldiagleft(uint8_t start_row, uint8_t end_row);

void SSD1306_Stopscroll(void);


/*************************************************************
****** SSD1306 Driver Functions API - Colour Inversion
**************************************************************/

void SSD1306_InvertDisplay (uint8_t EnOrDi);


/* C++ detection */
#ifdef __cplusplus
}
#endif

#endif

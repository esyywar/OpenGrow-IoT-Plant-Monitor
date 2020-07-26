/**
 * original author:  Tilen Majerle<tilen@majerle.eu>
 * modification for STM32f10x: Alexander Lutsai<s.lyra@ya.ru>
 * modification for STM32f4xx: Rahul Eswar

   ----------------------------------------------------------------------
    Copyright (C) Rahul Eswar, 2020
   	Copyright (C) Alexander Lutsai, 2016
    Copyright (C) Tilen Majerle, 2015

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
#include "ssd1306.h"

/*******************************************************
********** Private variables
*******************************************************/

/* Handle for SPI communication peripheral */
extern SPI_HandleTypeDef Spi2_oledWrite;

/* This variable should be defined in main */
extern SSD1306_t SSD1306_OledDisp;

/* SSD1306 data buffer */
static uint8_t SSD1306_Buffer[SSD1306_WIDTH * SSD1306_HEIGHT / 8];

/*******************************************************
********** Macros
*******************************************************/

/* Write command SPI */
#define SSD1306_SPI_WRITE_CMD(command) ssd1306_SPI_WriteCmd(command)

#define SSD1306_SPI_TIMEOUT 1000

/* Absolute value */
#define ABS(x) ((x) > 0 ? (x) : -(x))

/*********************************************************
********** SSD1306 Driver Functions API - Display Ctrl
*********************************************************/

void SSD1306_DrawBitmap(int16_t x, int16_t y, const unsigned char *bitmap, int16_t w, int16_t h, uint8_t colour)
{
	int16_t byteWidth = (w + 7) / 8; // Bitmap scanline pad = whole byte
	uint8_t byte = 0;

	for (int16_t j = 0; j < h; j++, y++)
	{
		for (int16_t i = 0; i < w; i++)
		{
			if (i & 7)
			{
				byte <<= 1;
			}
			else
			{
				byte = (*(const unsigned char *)(&bitmap[j * byteWidth + i / 8]));
			}

			if (byte & 0x80)
			{
				SSD1306_DrawPixel(x + i, y, colour);
			}
			else
			{
				SSD1306_DrawPixel(x + i, y, !colour);
			}
		}
	}
}

/**
 * @brief  Initializes SSD1306 OLED
 * @param  None
 * @retval Initialization status:
 *           - 0: SPI peripheral not initialized
 *           - 1: OLED initialized OK and ready to use
 */
uint8_t SSD1306_Init(void)
{
	/* Check that SPI peripheral is ready */
	if (HAL_SPI_GetState(&Spi2_oledWrite) != HAL_SPI_STATE_READY)
	{
		return SSD1306_FAILED;
	}

	/* Prepare to send command bits */
	SSD1306_CMD_ACCESS();

	/* Turn VDD (logic power) on and wait to come on */
	SSD1306_LOGIC_POWER_EN();
	HAL_Delay(10);

	/* Display off command */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_DISP_OFF);

	/* Reset the screen */
	SSD1306_Reset();

	/* Set up charge pump */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_CHRG_PUMP_SET);
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_CHRG_PUMP_EN);
	SSD1306_SPI_WRITE_CMD(SSD1306_CLK_CHRG_PRD_SET);
	SSD1306_SPI_WRITE_CMD(SSD1306_CLK_CHRG_PRD_VALUE);

	/* Clear screen and update */
	SSD1306_Clear();

	/* Give power to display and wait to come on */
	SSD1306_DISP_POWER_EN();
	HAL_Delay(100);

	/* Set oscillator frequency */
	SSD1306_SPI_WRITE_CMD(SSD1306_CLK_SET);
	SSD1306_SPI_WRITE_CMD(SSD1306_CLK_MAX);

	/* Set display contrast */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_CONTRAST_CTRL);
	SSD1306_SPI_WRITE_CMD(SSD1306_CONTRAST_VALUE);

	/* Multiplex ratio */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_MUX_RATIO_SET);
	SSD1306_SPI_WRITE_CMD(SSD1306_MUX_RATIO_VALUE);

	/* Set addressing mode (horizontal address mode) */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_ADDR_MODE_SET);
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_ADDR_MODE_HORZ);

	/* Invert rows and columns */
	SSD1306_SPI_WRITE_CMD(SSD1306_REMAP_COL127_SEG0);
	SSD1306_SPI_WRITE_CMD(SSD1306_REMAP_ROW_DEC);

	/* COM pins hardware configuration */
	SSD1306_SPI_WRITE_CMD(SSD1306_COM_HW_CONFIG_SET);
	SSD1306_SPI_WRITE_CMD(SSD1306_COM_HW_CONFIG_VALUE);

	/* Display colours in normal mode */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_NORM_DISP);

	/* Deactivate scrolling */
	SSD1306_SPI_WRITE_CMD(SSD1306_DEACTIVATE_SCROLL);

	/* Display on */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_DISP_ON);

	/* Initialize structure values */
	SSD1306_OledDisp.CurrentX = 0;
	SSD1306_OledDisp.CurrentY = 0;

	/* Initialized OK */
	SSD1306_OledDisp.Initialized = 1;
	SSD1306_OledDisp.state = SSD1306_STATE_READY;

	/* Hang until screen has been updated */
	while (SSD1306_OledDisp.state != SSD1306_STATE_READY)
		;

	/* Return OK */
	return SSD1306_OK;
}

/**
 * @brief  DeInitialize and power down SSD1306 OLED
 */
uint8_t SSD1306_DeInit(void)
{
	/* Check that display is in initialized state */
	if (!SSD1306_OledDisp.Initialized)
	{
		return SSD1306_FAILED;
	}

	/* Prepare to send command bits */
	SSD1306_CMD_ACCESS();

	/* Display off command */
	SSD1306_SPI_WRITE_CMD(SSD1306_CMD_DISP_OFF);

	/* VBAT off - cut power to display */
	SSD1306_DISP_POWER_DI();

	/* 100 ms delay */
	HAL_Delay(100);

	/* VDD off - cut power to logic */
	SSD1306_LOGIC_POWER_DI();

	/* Set structure values */
	SSD1306_OledDisp.Initialized = 0;

	return SSD1306_OK;
}

/** 
 * @brief  Reset the OLED display
 */
void SSD1306_Reset(void)
{
	SSD1306_RESET_LOW();
	HAL_Delay(1);
	SSD1306_RESET_HIGH();
}

/** 
 * @brief  Toggle the display on and off
 */
void SSD1306_Switch(void)
{
	if (SSD1306_OledDisp.Initialized)
	{
		SSD1306_DeInit();
	}
	else
	{
		SSD1306_Init();
	}
}

/** 
 * @brief  Updates buffer from internal RAM to OLED with SSD1306 in horizontal addressing mode (blocks until interrupt function initialized)
 * @note   This function must be called each time you do some changes to OLED, to update buffer from RAM to OLED
 */
void SSD1306_UpdateScreen(void)
{
	/* Writing data to display buffer - non-blocking function with SPI and DMA */
	while (ssd1306_SPI_WriteDisp(SSD1306_Buffer) != SSD1306_STATE_READY)
		;
}

/**
 * @brief  Toggles pixels invertion inside internal RAM
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 */
void SSD1306_ToggleInvert(void)
{
	uint16_t i;

	/* Toggle invert */
	SSD1306_OledDisp.Inverted = !SSD1306_OledDisp.Inverted;

	/* Do memory toggle */
	for (i = 0; i < sizeof(SSD1306_Buffer); i++)
	{
		SSD1306_Buffer[i] = ~SSD1306_Buffer[i];
	}
}

/** 
 * @brief  Fills entire OLED buffer with desired color
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  Color: Color to be used for screen fill. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_Fill(uint8_t colour)
{
	/* Set memory */
	memset(SSD1306_Buffer, (colour == SSD1306_PX_CLR_BLACK) ? 0x00 : 0xFF, sizeof(SSD1306_Buffer));
}

/** 
 * @brief  Fills OLED with desired colour to right of indicated column (for horizontal and page addressing modes)
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  Color: Color to be used for screen fill. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_Fill_ToRight(uint8_t startCol, uint8_t colour)
{
	for (uint8_t i = 0; i < SSD1306_PAGES; i++)
	{
		memset(SSD1306_Buffer + startCol + (i * SSD1306_WIDTH), (colour == SSD1306_PX_CLR_BLACK) ? 0x00 : 0xFF, SSD1306_WIDTH - startCol);
	}
}

/** 
 * @brief  Fills OLED with desired colour to left of indicated column (for horizontal and page addressing modes)
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  Color: Color to be used for screen fill. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_Fill_ToLeft(uint8_t startCol, uint8_t colour)
{
	for (uint8_t i = 0; i < SSD1306_PAGES; i++)
	{
		memset(SSD1306_Buffer + (i * SSD1306_WIDTH), (colour == SSD1306_PX_CLR_BLACK) ? 0x00 : 0xFF, startCol);
	}
}

/**
 * @brief  Writes pixel value to the data buffer - configured to work with SSD1306 in horizontal or page addressing mode
 * @note   @ref SSD1306_UpdateScreen() must called after that in order to see updated LCD screen
 * @param  x: X location. This parameter can be a value between 0 and SSD1306_WIDTH - 1
 * @param  y: Y location. This parameter can be a value between 0 and SSD1306_HEIGHT - 1
 * @param  color: Color to be used for screen fill. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawPixel(uint16_t x, uint16_t y, uint8_t colour)
{
	if (x >= SSD1306_WIDTH || y >= SSD1306_HEIGHT)
	{
		/* Error */
		return;
	}

	/* Check if pixels are inverted */
	if (SSD1306_OledDisp.Inverted)
	{
		colour = !colour;
	}

	/* Set color */
	if (colour == SSD1306_PX_CLR_WHITE)
	{
		SSD1306_Buffer[x + (y / 8) * SSD1306_WIDTH] |= 1 << (y % 8);
	}
	else
	{
		SSD1306_Buffer[x + (y / 8) * SSD1306_WIDTH] &= ~(1 << (y % 8));
	}
}

/**
 * @brief  Sets cursor pointer to desired location for strings
 * @param  x: X location. This parameter can be a value between 0 and SSD1306_WIDTH - 1
 * @param  y: Y location. This parameter can be a value between 0 and SSD1306_HEIGHT - 1
 */
void SSD1306_GotoXY(uint16_t x, uint16_t y)
{
	/* Set write pointers */
	SSD1306_OledDisp.CurrentX = x;
	SSD1306_OledDisp.CurrentY = y;
}

/**
 * @brief  Puts character to internal RAM
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  ch: Character to be written
 * @param  *Font: Pointer to @ref FontDef_t structure with used font
 * @param  color: Color used for drawing. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 * @retval Character written
 */
char SSD1306_Putc(char ch, FontDef_t *Font, uint8_t colour)
{
	uint32_t i, b, j;

	/* Check available space in LCD */
	if (
		SSD1306_WIDTH <= (SSD1306_OledDisp.CurrentX + Font->FontWidth) ||
		SSD1306_HEIGHT <= (SSD1306_OledDisp.CurrentY + Font->FontHeight))
	{
		/* Error */
		return 0;
	}

	/* Go through font */
	for (i = 0; i < Font->FontHeight; i++)
	{
		b = Font->data[(ch - 32) * Font->FontHeight + i];
		for (j = 0; j < Font->FontWidth; j++)
		{
			if ((b << j) & 0x8000)
			{
				SSD1306_DrawPixel(SSD1306_OledDisp.CurrentX + j, (SSD1306_OledDisp.CurrentY + i), colour);
			}
			else
			{
				SSD1306_DrawPixel(SSD1306_OledDisp.CurrentX + j, (SSD1306_OledDisp.CurrentY + i), !colour);
			}
		}
	}

	/* Increase pointer */
	SSD1306_OledDisp.CurrentX += Font->FontWidth;

	/* Return character written */
	return ch;
}

char SSD1306_Puts(char *str, FontDef_t *Font, uint8_t colour)
{
	/* Write characters */
	while (*str)
	{
		/* Write character by character */
		if (SSD1306_Putc(*str, Font, colour) != *str)
		{
			/* Return error */
			return *str;
		}

		/* Increase string pointer */
		str++;
	}

	/* Everything OK, zero should be returned */
	return *str;
}

void SSD1306_DrawLine(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, uint8_t colour)
{
	int16_t dx, dy, sx, sy, err, e2, i, tmp;

	/* Check for overflow */
	if (x0 >= SSD1306_WIDTH)
	{
		x0 = SSD1306_WIDTH - 1;
	}
	if (x1 >= SSD1306_WIDTH)
	{
		x1 = SSD1306_WIDTH - 1;
	}
	if (y0 >= SSD1306_HEIGHT)
	{
		y0 = SSD1306_HEIGHT - 1;
	}
	if (y1 >= SSD1306_HEIGHT)
	{
		y1 = SSD1306_HEIGHT - 1;
	}

	dx = (x0 < x1) ? (x1 - x0) : (x0 - x1);
	dy = (y0 < y1) ? (y1 - y0) : (y0 - y1);
	sx = (x0 < x1) ? 1 : -1;
	sy = (y0 < y1) ? 1 : -1;
	err = ((dx > dy) ? dx : -dy) / 2;

	if (dx == 0)
	{
		if (y1 < y0)
		{
			tmp = y1;
			y1 = y0;
			y0 = tmp;
		}

		if (x1 < x0)
		{
			tmp = x1;
			x1 = x0;
			x0 = tmp;
		}

		/* Vertical line */
		for (i = y0; i <= y1; i++)
		{
			SSD1306_DrawPixel(x0, i, colour);
		}

		/* Return from function */
		return;
	}

	if (dy == 0)
	{
		if (y1 < y0)
		{
			tmp = y1;
			y1 = y0;
			y0 = tmp;
		}

		if (x1 < x0)
		{
			tmp = x1;
			x1 = x0;
			x0 = tmp;
		}

		/* Horizontal line */
		for (i = x0; i <= x1; i++)
		{
			SSD1306_DrawPixel(i, y0, colour);
		}

		/* Return from function */
		return;
	}

	while (1)
	{
		SSD1306_DrawPixel(x0, y0, colour);
		if (x0 == x1 && y0 == y1)
		{
			break;
		}
		e2 = err;
		if (e2 > -dx)
		{
			err -= dy;
			x0 += sx;
		}
		if (e2 < dy)
		{
			err += dx;
			y0 += sy;
		}
	}
}

/**
 * @brief  Draws rectangle on OLED
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: Top left X start point. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Top left Y start point. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  w: Rectangle width in units of pixels
 * @param  h: Rectangle height in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawRectangle(uint16_t x, uint16_t y, uint16_t w, uint16_t h, uint8_t colour)
{
	/* Check input parameters */
	if (x >= SSD1306_WIDTH || y >= SSD1306_HEIGHT)
	{
		/* Return error */
		return;
	}

	/* Check width and height */
	if ((x + w) >= SSD1306_WIDTH)
	{
		w = SSD1306_WIDTH - x;
	}
	if ((y + h) >= SSD1306_HEIGHT)
	{
		h = SSD1306_HEIGHT - y;
	}

	/* Draw 4 lines */
	SSD1306_DrawLine(x, y, x + w, y, colour);		  /* Top line */
	SSD1306_DrawLine(x, y + h, x + w, y + h, colour); /* Bottom line */
	SSD1306_DrawLine(x, y, x, y + h, colour);		  /* Left line */
	SSD1306_DrawLine(x + w, y, x + w, y + h, colour); /* Right line */
}

/**
 * @brief  Draws filled rectangle on OLED
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: Top left X start point. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Top left Y start point. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  w: Rectangle width in units of pixels
 * @param  h: Rectangle height in units of pixels
 * @param  c: Color to be used.
 */
void SSD1306_DrawFilledRectangle(uint16_t x, uint16_t y, uint16_t w, uint16_t h, uint8_t colour)
{
	uint8_t i;

	/* Check input parameters */
	if (x >= SSD1306_WIDTH || y >= SSD1306_HEIGHT)
	{
		/* Return error */
		return;
	}

	/* Check width and height */
	if ((x + w) >= SSD1306_WIDTH)
	{
		w = SSD1306_WIDTH - x;
	}
	if ((y + h) >= SSD1306_HEIGHT)
	{
		h = SSD1306_HEIGHT - y;
	}

	/* Draw lines */
	for (i = 0; i <= h; i++)
	{
		/* Draw lines */
		SSD1306_DrawLine(x, y + i, x + w, y + i, colour);
	}
}

/**
 * @brief  Draws triangle on LCD
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x1: First coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y1: First coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x2: Second coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y2: Second coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  x3: Third coordinate X location. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y3: Third coordinate Y location. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawTriangle(uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2, uint16_t x3, uint16_t y3, uint8_t colour)
{
	/* Draw lines */
	SSD1306_DrawLine(x1, y1, x2, y2, colour);
	SSD1306_DrawLine(x2, y2, x3, y3, colour);
	SSD1306_DrawLine(x3, y3, x1, y1, colour);
}

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
void SSD1306_DrawFilledTriangle(uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2, uint16_t x3, uint16_t y3, uint8_t colour)
{
	int16_t deltax = 0, deltay = 0, x = 0, y = 0, xinc1 = 0, xinc2 = 0,
			yinc1 = 0, yinc2 = 0, den = 0, num = 0, numadd = 0, numpixels = 0,
			curpixel = 0;

	deltax = ABS(x2 - x1);
	deltay = ABS(y2 - y1);
	x = x1;
	y = y1;

	if (x2 >= x1)
	{
		xinc1 = 1;
		xinc2 = 1;
	}
	else
	{
		xinc1 = -1;
		xinc2 = -1;
	}

	if (y2 >= y1)
	{
		yinc1 = 1;
		yinc2 = 1;
	}
	else
	{
		yinc1 = -1;
		yinc2 = -1;
	}

	if (deltax >= deltay)
	{
		xinc1 = 0;
		yinc2 = 0;
		den = deltax;
		num = deltax / 2;
		numadd = deltay;
		numpixels = deltax;
	}
	else
	{
		xinc2 = 0;
		yinc1 = 0;
		den = deltay;
		num = deltay / 2;
		numadd = deltax;
		numpixels = deltay;
	}

	for (curpixel = 0; curpixel <= numpixels; curpixel++)
	{
		SSD1306_DrawLine(x, y, x3, y3, colour);

		num += numadd;
		if (num >= den)
		{
			num -= den;
			x += xinc1;
			y += yinc1;
		}
		x += xinc2;
		y += yinc2;
	}
}

/**
 * @brief  Draws circle to STM buffer
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: X location for center of circle. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Y location for center of circle. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  r: Circle radius in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawCircle(int16_t x0, int16_t y0, int16_t r, uint8_t colour)
{
	int16_t f = 1 - r;
	int16_t ddF_x = 1;
	int16_t ddF_y = -2 * r;
	int16_t x = 0;
	int16_t y = r;

	SSD1306_DrawPixel(x0, y0 + r, colour);
	SSD1306_DrawPixel(x0, y0 - r, colour);
	SSD1306_DrawPixel(x0 + r, y0, colour);
	SSD1306_DrawPixel(x0 - r, y0, colour);

	while (x < y)
	{
		if (f >= 0)
		{
			y--;
			ddF_y += 2;
			f += ddF_y;
		}
		x++;
		ddF_x += 2;
		f += ddF_x;

		SSD1306_DrawPixel(x0 + x, y0 + y, colour);
		SSD1306_DrawPixel(x0 - x, y0 + y, colour);
		SSD1306_DrawPixel(x0 + x, y0 - y, colour);
		SSD1306_DrawPixel(x0 - x, y0 - y, colour);

		SSD1306_DrawPixel(x0 + y, y0 + x, colour);
		SSD1306_DrawPixel(x0 - y, y0 + x, colour);
		SSD1306_DrawPixel(x0 + y, y0 - x, colour);
		SSD1306_DrawPixel(x0 - y, y0 - x, colour);
	}
}

/**
 * @brief  Draws filled circle to STM buffer
 * @note   @ref SSD1306_UpdateScreen() must be called after that in order to see updated LCD screen
 * @param  x: X location for center of circle. Valid input is 0 to SSD1306_WIDTH - 1
 * @param  y: Y location for center of circle. Valid input is 0 to SSD1306_HEIGHT - 1
 * @param  r: Circle radius in units of pixels
 * @param  c: Color to be used. This parameter can be a value of @ref SSD1306_COLOR_t enumeration
 */
void SSD1306_DrawFilledCircle(int16_t x0, int16_t y0, int16_t r, uint8_t colour)
{
	int16_t f = 1 - r;
	int16_t ddF_x = 1;
	int16_t ddF_y = -2 * r;
	int16_t x = 0;
	int16_t y = r;

	SSD1306_DrawPixel(x0, y0 + r, colour);
	SSD1306_DrawPixel(x0, y0 - r, colour);
	SSD1306_DrawPixel(x0 + r, y0, colour);
	SSD1306_DrawPixel(x0 - r, y0, colour);
	SSD1306_DrawLine(x0 - r, y0, x0 + r, y0, colour);

	while (x < y)
	{
		if (f >= 0)
		{
			y--;
			ddF_y += 2;
			f += ddF_y;
		}

		x++;
		ddF_x += 2;
		f += ddF_x;

		SSD1306_DrawLine(x0 - x, y0 + y, x0 + x, y0 + y, colour);
		SSD1306_DrawLine(x0 + x, y0 - y, x0 - x, y0 - y, colour);

		SSD1306_DrawLine(x0 + y, y0 + x, x0 - y, y0 + x, colour);
		SSD1306_DrawLine(x0 + y, y0 - x, x0 - y, y0 - x, colour);
	}
}

/** 
 * @brief  Clears the screen
 */
void SSD1306_Clear(void)
{
	SSD1306_Fill(SSD1306_PX_CLR_BLACK);
	SSD1306_UpdateScreen();
}

/*************************************************************
****** SSD1306 Driver Functions API - Data Communication
**************************************************************/

/*
* SPI communication drivers 
*/

/**
 * @brief  Writes a 8-bit command to the ssd1306 - this function blocks while sending data
 * @param  uint8_t* pTxBuffer - pointer to the data buffer
 * @param  uint8_t len - length of data to be sent
 */
void ssd1306_SPI_WriteCmd(uint8_t command)
{
	SSD1306_CMD_ACCESS();
	HAL_SPI_Transmit(&Spi2_oledWrite, &command, 1, SSD1306_SPI_TIMEOUT);
}

/**
 * @brief  Fills the display data buffer with new screen using DMA to transfer (length is size of SSD1306 buffer defined in ssd1306.c)
 * @param  uint8_t* pTxBuffer - pointer to the data buffer
 */
uint8_t ssd1306_SPI_WriteDisp(uint8_t *pTxBuffer)
{
	uint8_t state = SSD1306_OledDisp.state;

	if (state == SSD1306_STATE_READY)
	{
		/* Set state to busy */
		SSD1306_OledDisp.state = SSD1306_STATE_BUSY;

		/* Set D/C high for data buffer access */
		SSD1306_DISP_ACCESS();

		/* DMA enabled send with SPI - callback function run when complete */
		while (HAL_SPI_Transmit_DMA(&Spi2_oledWrite, pTxBuffer, (uint16_t)sizeof(SSD1306_Buffer)) != HAL_OK);
	}

	return state;
}

/* Invert display by writing command to SSD1306 */
void SSD1306_InvertDisplay(uint8_t EnOrDi)
{
	SSD1306_CMD_ACCESS();

	if (EnOrDi == SSD1306_ENABLE)
	{
		SSD1306_SPI_WRITE_CMD(SSD1306_CMD_INVERT_DISP);
	}
	else
	{
		SSD1306_SPI_WRITE_CMD(SSD1306_CMD_NORM_DISP);
	}
}

/*************************************************************
****** SSD1306 Driver Functions API - Scrolling functions
**************************************************************/

void SSD1306_ScrollRight(uint8_t start_row, uint8_t end_row)
{
	SSD1306_CMD_ACCESS();

	SSD1306_SPI_WRITE_CMD(SSD1306_RIGHT_HORIZONTAL_SCROLL); // send 0x26
	SSD1306_SPI_WRITE_CMD(0x00);							// send dummy
	SSD1306_SPI_WRITE_CMD(start_row);						// start page address
	SSD1306_SPI_WRITE_CMD(0X00);							// time interval 5 frames
	SSD1306_SPI_WRITE_CMD(end_row);							// end page address
	SSD1306_SPI_WRITE_CMD(0X00);
	SSD1306_SPI_WRITE_CMD(0XFF);
	SSD1306_SPI_WRITE_CMD(SSD1306_ACTIVATE_SCROLL); // start scroll
}

void SSD1306_ScrollLeft(uint8_t start_row, uint8_t end_row)
{
	SSD1306_CMD_ACCESS();

	SSD1306_SPI_WRITE_CMD(SSD1306_LEFT_HORIZONTAL_SCROLL); // send 0x26
	SSD1306_SPI_WRITE_CMD(0x00);						   // send dummy
	SSD1306_SPI_WRITE_CMD(start_row);					   // start page address
	SSD1306_SPI_WRITE_CMD(0X00);						   // time interval 5 frames
	SSD1306_SPI_WRITE_CMD(end_row);						   // end page address
	SSD1306_SPI_WRITE_CMD(0X00);
	SSD1306_SPI_WRITE_CMD(0XFF);
	SSD1306_SPI_WRITE_CMD(SSD1306_ACTIVATE_SCROLL); // start scroll
}

void SSD1306_Scrolldiagright(uint8_t start_row, uint8_t end_row)
{
	SSD1306_CMD_ACCESS();

	SSD1306_SPI_WRITE_CMD(SSD1306_SET_VERTICAL_SCROLL_AREA); // sect the area
	SSD1306_SPI_WRITE_CMD(0x00);							 // write dummy
	SSD1306_SPI_WRITE_CMD(SSD1306_HEIGHT);

	SSD1306_SPI_WRITE_CMD(SSD1306_VERTICAL_AND_RIGHT_HORIZONTAL_SCROLL);
	SSD1306_SPI_WRITE_CMD(0x00);
	SSD1306_SPI_WRITE_CMD(start_row);
	SSD1306_SPI_WRITE_CMD(0X00);
	SSD1306_SPI_WRITE_CMD(end_row);
	SSD1306_SPI_WRITE_CMD(0x01);
	SSD1306_SPI_WRITE_CMD(SSD1306_ACTIVATE_SCROLL);
}

void SSD1306_Scrolldiagleft(uint8_t start_row, uint8_t end_row)
{
	SSD1306_CMD_ACCESS();

	SSD1306_SPI_WRITE_CMD(SSD1306_SET_VERTICAL_SCROLL_AREA); // sect the area
	SSD1306_SPI_WRITE_CMD(0x00);							 // write dummy
	SSD1306_SPI_WRITE_CMD(SSD1306_HEIGHT);

	SSD1306_SPI_WRITE_CMD(SSD1306_VERTICAL_AND_LEFT_HORIZONTAL_SCROLL);
	SSD1306_SPI_WRITE_CMD(0x00);
	SSD1306_SPI_WRITE_CMD(start_row);
	SSD1306_SPI_WRITE_CMD(0X00);
	SSD1306_SPI_WRITE_CMD(end_row);
	SSD1306_SPI_WRITE_CMD(0x01);
	SSD1306_SPI_WRITE_CMD(SSD1306_ACTIVATE_SCROLL);
}

void SSD1306_Stopscroll(void)
{
	SSD1306_CMD_ACCESS();

	SSD1306_SPI_WRITE_CMD(SSD1306_DEACTIVATE_SCROLL);
}

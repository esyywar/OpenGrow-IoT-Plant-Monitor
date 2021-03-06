/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2020 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under BSD 3-Clause license,
  * the "License"; You may not use this file except in compliance with the
  * License. You may obtain a copy of the License at:
  *                        opensource.org/licenses/BSD-3-Clause
  *
  ******************************************************************************
  */
/* USER CODE END Header */

/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Import freeRTOS */
#include "FreeRTOS.h"
#include "task.h"
#include "timers.h"
#include "semphr.h"
#include "queue.h"
#include "event_groups.h"

/* Standard libraries */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <math.h>

/* SSD1306 drivers */
#include "ssd1306.h"
#include "fonts.h"
#include "bitmap.h"

/*******************************************************
********** Peripheral handles **************************
*******************************************************/

ADC_HandleTypeDef hadc1;
DMA_HandleTypeDef hdma_adc1;

I2C_HandleTypeDef hi2c1;

SPI_HandleTypeDef Spi_ssd1306Write;
DMA_HandleTypeDef hdma_spi2_tx;

UART_HandleTypeDef huart2;

/*******************************************************
*********** Private variables **************************
*******************************************************/

/*	Buffer for raw plant metric sensors
*		Index 0 -> capacitive soil moisture
*		Index 1 -> Photoresistor voltage divider
*/
uint16_t ucPlantSensors[2];

/* Structure for SSD1306 handle */
SSD1306_t SSD1306_Disp;

/* Buffer for values appearing on OLED */
char pcSoilMoistureDisp[11] = "Soil: ";
char pcLightLevelDisp[12] = "Light: ";
char pcSetpointDisp[10] = "Setpt: ";
char pcToleranceDisp[10] = "Toler: ";

/* Moisture control variables */
uint16_t ucMoistureSetpoint;

/* How far to let moisture drift from setpoint before watering */
uint16_t ucMoistureTolerance;

/* Flags to indicate if control data has been updated */
uint8_t ucControlUpdateFlag = RESET;

/* PID controller coefficients (initialized to default values) */
float proportionCoeff = PID_P_DEFAULT;
float integralCoeff = PID_I_DEFAULT;
float derivativeCoeff = PID_D_DEFAULT;

/* Data buffers for I2C from ESP8266 */
uint8_t ucEspCmdCode;

/* Sum of moisture used to calculate PID response values */
int32_t moistureErrorSum = 0;

/*******************************************************
********** Thread functions ****************************
*******************************************************/

void Blinky_1(void *pvParameters);
void OLED_Update(void *pvParameters);
void OLED_Bitmap_Flip(void *pvParameters);
void OLED_Data_Write(void *pvParameters);
void Sensor_Read(void *pvParameters);
void Water_Plant(void *pvParameters);
void Flash_Update(void *pvParameters);

/* Create semaphores */
SemaphoreHandle_t Sensor_Sema_Handle;
SemaphoreHandle_t Oled_Buffer_Sema_Handle;
SemaphoreHandle_t Setpoint_Sema_Handle;
SemaphoreHandle_t Tolerance_Sema_Handle;

/* Initialization functions */
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_DMA_Init(void);
static void MX_ADC1_Init(void);
static void MX_I2C1_Init(void);
static void MX_SPI2_Init(void);
static void MX_USART2_UART_Init(void);
void StartDefaultTask(void *argument);

/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{
  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* Configure the system clock */
  SystemClock_Config();

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_DMA_Init();
  MX_ADC1_Init();
  MX_I2C1_Init();
  MX_SPI2_Init();
  MX_USART2_UART_Init();

  /* Initialize OLED display */
  configASSERT(SSD1306_Init() == SSD1306_OK);

  /* Binary semaphores */
  Sensor_Sema_Handle = xSemaphoreCreateBinary();
  Oled_Buffer_Sema_Handle = xSemaphoreCreateBinary();
  Setpoint_Sema_Handle = xSemaphoreCreateBinary();
  Tolerance_Sema_Handle = xSemaphoreCreateBinary();

  /* Assert correct initialization of semaphores */
  configASSERT(Sensor_Sema_Handle && Oled_Buffer_Sema_Handle && Setpoint_Sema_Handle && Tolerance_Sema_Handle);

  /* Initialize semaphore by giving */
  xSemaphoreGive(Sensor_Sema_Handle);
  xSemaphoreGive(Oled_Buffer_Sema_Handle);
  xSemaphoreGive(Setpoint_Sema_Handle);
  xSemaphoreGive(Tolerance_Sema_Handle);

  /* Task handlers */
  TaskHandle_t Sensor_Read_TaskHandle;
  TaskHandle_t OLED_Update_TaskHandle;
  TaskHandle_t OLED_Data_Write_TaskHandle;
  TaskHandle_t OLED_Bitmap_Flip_TaskHandle;
  TaskHandle_t Water_Plant_TaskHandle;
  TaskHandle_t Flash_Update_TaskHandle;

  /* Register tasks (each with 128 byte stack size) */
  xTaskCreate(Sensor_Read, "Sensor_Read", 32, NULL, 8, &Sensor_Read_TaskHandle);
  xTaskCreate(OLED_Update, "OLED_Update", 32, NULL, 5, &OLED_Update_TaskHandle);
  xTaskCreate(OLED_Data_Write, "OLED_Data_Write", 64, NULL, 7, &OLED_Data_Write_TaskHandle);
  xTaskCreate(OLED_Bitmap_Flip, "OLED_Bitmap_Flip", 32, NULL, 6, &OLED_Bitmap_Flip_TaskHandle);
  xTaskCreate(Water_Plant, "Water_Plant", 64, NULL, 10, &Water_Plant_TaskHandle);
  xTaskCreate(Flash_Update, "Flash_Update", 32, NULL, 9, &Flash_Update_TaskHandle);

  /* Read the control data values from flash memory (or load default if blank) */
  HAL_FLASH_Unlock();
  uint16_t* flashCtrlData = (uint16_t*)FLASH_CONTROL_DATA_ADDR;
  ucMoistureSetpoint = flashCtrlData[0] == 0xFFFF ? PLANT_SETPOINT_DEFAULT : flashCtrlData[0];
  ucMoistureTolerance = flashCtrlData[1] == 0xFFFF ? PLANT_TOLERANCE_DEFAULT : flashCtrlData[1];
  HAL_FLASH_Lock();

  /* Listen for commands from ESP I2C master (Need to always be listening for this) */
  HAL_I2C_Slave_Receive_IT(&hi2c1, &ucEspCmdCode, 1);

  /* Start scheduler */
  vTaskStartScheduler();
 
  /* We should never get here as control is now taken by the scheduler */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage 
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);
  /** Initializes the CPU, AHB and APB busses clocks 
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL.PLLM = 8;
  RCC_OscInitStruct.PLL.PLLN = 180;
  RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
  RCC_OscInitStruct.PLL.PLLQ = 2;
  RCC_OscInitStruct.PLL.PLLR = 2;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }
  /** Activate the Over-Drive mode 
  */
  if (HAL_PWREx_EnableOverDrive() != HAL_OK)
  {
    Error_Handler();
  }
  /** Initializes the CPU, AHB and APB busses clocks 
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV4;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV2;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_5) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief ADC1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_ADC1_Init(void)
{
  ADC_ChannelConfTypeDef sConfig = {0};

  /* USER CODE END ADC1_Init 1 */
  /** Configure the global features of the ADC (Clock, Resolution, Data Alignment and number of conversion) 
  */
  hadc1.Instance = ADC1;
  hadc1.Init.ClockPrescaler = ADC_CLOCK_SYNC_PCLK_DIV4;
  hadc1.Init.Resolution = ADC_RESOLUTION_12B;
  hadc1.Init.ScanConvMode = ENABLE;
  hadc1.Init.ContinuousConvMode = DISABLE;
  hadc1.Init.DiscontinuousConvMode = DISABLE;
  hadc1.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_NONE;
  hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
  hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  hadc1.Init.NbrOfConversion = 2;
  hadc1.Init.DMAContinuousRequests = ENABLE;
  hadc1.Init.EOCSelection = ADC_EOC_SINGLE_CONV;

  if (HAL_ADC_Init(&hadc1) != HAL_OK)
  {
    Error_Handler();
  }

  /** Configure for the selected ADC regular channel its corresponding rank in the sequencer and its sample time. */
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = 1;
  sConfig.SamplingTime = ADC_SAMPLETIME_3CYCLES;

  if (HAL_ADC_ConfigChannel(&hadc1, &sConfig) != HAL_OK)
  {
    Error_Handler();
  }

  /** Configure for the selected ADC regular channel its corresponding rank in the sequencer and its sample time. */
  sConfig.Channel = ADC_CHANNEL_1;
  sConfig.Rank = 2;
  if (HAL_ADC_ConfigChannel(&hadc1, &sConfig) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief I2C1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_I2C1_Init(void)
{
  hi2c1.Instance = I2C1;
  hi2c1.Init.ClockSpeed = 100000;
  hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c1.Init.OwnAddress1 = STM32_I2C_ADDR;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.OwnAddress2 = 0;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;

  if (HAL_I2C_Init(&hi2c1) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief SPI2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_SPI2_Init(void)
{
  /* USER CODE END SPI2_Init 1 */
  /* SPI2 parameter configuration*/
  Spi_ssd1306Write.Instance = SPI2;
  Spi_ssd1306Write.Init.Mode = SPI_MODE_MASTER;
  Spi_ssd1306Write.Init.Direction = SPI_DIRECTION_1LINE;
  Spi_ssd1306Write.Init.DataSize = SPI_DATASIZE_8BIT;
  Spi_ssd1306Write.Init.CLKPolarity = SPI_POLARITY_LOW;
  Spi_ssd1306Write.Init.CLKPhase = SPI_PHASE_1EDGE;
  Spi_ssd1306Write.Init.NSS = SPI_NSS_HARD_OUTPUT;
  Spi_ssd1306Write.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_2;
  Spi_ssd1306Write.Init.FirstBit = SPI_FIRSTBIT_MSB;
  Spi_ssd1306Write.Init.TIMode = SPI_TIMODE_DISABLE;
  Spi_ssd1306Write.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
  Spi_ssd1306Write.Init.CRCPolynomial = 10;

  if (HAL_SPI_Init(&Spi_ssd1306Write) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 14400;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;

  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
}

/** 
  * Enable DMA controller clock
  */
static void MX_DMA_Init(void) 
{
  /* DMA controller clock enable */
  __HAL_RCC_DMA1_CLK_ENABLE();
  __HAL_RCC_DMA2_CLK_ENABLE();

  /* DMA interrupt init */
  /* DMA1_Stream4_IRQn interrupt configuration */
  HAL_NVIC_SetPriority(DMA1_Stream4_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(DMA1_Stream4_IRQn);

  /* DMA2_Stream0_IRQn interrupt configuration */
  HAL_NVIC_SetPriority(DMA2_Stream0_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(DMA2_Stream0_IRQn);
}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin : PC13 -> On-board button */
  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

  /* DMA2_Stream0_IRQn interrupt configuration */
  HAL_NVIC_SetPriority(EXTI15_10_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);

  /*Configure GPIO pin : PA5 -> On-board LED */
  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /*Configure GPIO pins : PC5 PC6 PC7 PC8 -> Control pins for SSD1306 display */
  GPIO_InitStruct.Pin = GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_7|GPIO_PIN_8;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

  /*Configure GPIO pin : PB7 -> Water pump transistor switch */
  GPIO_InitStruct.Pin = GPIO_PIN_7;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
}

/**
  * @brief  Update the OLED screen by writing contents of the buffer.
  * @param  argument: Not used
  * @retval None
  */
void OLED_Update( void *pvParameters )
{
	for(;;)
	{
		if ( xSemaphoreTake( Oled_Buffer_Sema_Handle, (TickType_t) 0 ) == pdTRUE )
		{
			SSD1306_UpdateScreen();
		}

		vTaskDelay(RTOS_UPDATE_OLED_DISP);
	}
}


/**
  * @brief  Switch between the 2 bitmaps on OLED display.
  * @param  argument: Not used
  * @retval None
  */
void OLED_Bitmap_Flip( void *pvParameters )
{
	for(;;)
	{
		static bool sudoFlip = true;

		if (xSemaphoreTake( Oled_Buffer_Sema_Handle, (TickType_t) 10 ) == pdTRUE )
		{
			SSD1306_DrawBitmap(0, 0, sudoFlip ? sudowoodopose1 : sudowoodopose2, 32, 32, SSD1306_PX_CLR_WHITE);

			sudoFlip = !sudoFlip;

			xSemaphoreGive(Oled_Buffer_Sema_Handle);
		}

		vTaskDelay(RTOS_OLED_BITMAP_FLIP);
	}
}

/**
  * @brief  Function implementing the Update_OLED thread.
  * @param  argument: Not used
  * @retval None
  */
void OLED_Data_Write( void *pvParameters )
{
	for(;;)
	{
		/* Count interations to periodically switch display from (soil and light sensor readings) to (setpoint and tolerance) */
		static uint8_t ucCntTimer = 0;
		static bool isCtrlDisplay = false;

		/* String buffers to display on OLED screen */
		char *pcTopDisp, *pcBtmDisp;

		if( isCtrlDisplay )
		{
			/* Append setpoint and tolerance data to display string */
			if( xSemaphoreTake( Setpoint_Sema_Handle, (TickType_t) 10 ) == pdTRUE &&  xSemaphoreTake( Tolerance_Sema_Handle, (TickType_t) 10 ) == pdTRUE)
			{
				itoa(ucMoistureSetpoint, pcSetpointDisp + 7, 10);
				itoa(ucMoistureTolerance, pcToleranceDisp + 7, 10);

				xSemaphoreGive(Setpoint_Sema_Handle);
				xSemaphoreGive(Tolerance_Sema_Handle);
			}

			pcTopDisp = pcSetpointDisp;
			pcBtmDisp = pcToleranceDisp;
		}
		else
		{
			/* Append sensor values to display string */
			if( xSemaphoreTake( Sensor_Sema_Handle, (TickType_t) 10 ) == pdTRUE  )
			{
				itoa(ucPlantSensors[0], pcSoilMoistureDisp + 6, 10);
				itoa(ucPlantSensors[1], pcLightLevelDisp + 7, 10);

				xSemaphoreGive(Sensor_Sema_Handle);
			}

			pcTopDisp = pcSoilMoistureDisp;
			pcBtmDisp = pcLightLevelDisp;
		}


		/* Write sensor values to OLED buffer */
		if( xSemaphoreTake( Oled_Buffer_Sema_Handle, (TickType_t) 10 ) == pdTRUE )
		{
			SSD1306_Fill_ToRight(40, SSD1306_PX_CLR_BLACK);

			SSD1306_GotoXY(40, 5);
			SSD1306_Puts(pcTopDisp, &Font_7x10, SSD1306_PX_CLR_WHITE);
			SSD1306_GotoXY(40, 21);
			SSD1306_Puts(pcBtmDisp, &Font_7x10, SSD1306_PX_CLR_WHITE);

			xSemaphoreGive(Oled_Buffer_Sema_Handle);
		}

		/* Every 100 iterations switch the display from (soil and light data) to (setpoint and tolerance) */
		if( ++ucCntTimer >= 100 )
		{
			isCtrlDisplay = !isCtrlDisplay;
			ucCntTimer = 0;
		}

		vTaskDelay(RTOS_OLED_WRITE_DISP);
	}
}

/**
* @brief Take analog readings from capacitive soil moisture sensor and photoresistor circuit.
* @param argument: Not used
* @retval None
*/
void Sensor_Read( void *pvParameters )
{
	for(;;)
	{
		/* Read value from ADCs into sensor value variables */
		if( xSemaphoreTake( Sensor_Sema_Handle, (TickType_t) 10 ) == pdTRUE  )
		{
			/* Read value from ADC1 at pin GPIO A0 */
			HAL_ADC_Start_DMA(&hadc1, (uint32_t*)ucPlantSensors, 2);
		}

		vTaskDelay(RTOS_GET_SENSOR_DATA);
	}
}

/**
* @brief Compare soil moisture readings to setpoints and water plant if necessary.
* @param argument: Not used
* @retval None
*/
void Water_Plant( void *pvParameters )
{
	for(;;)
	{
		/* Every 5 minutes beginning 5 min after initialization */
		vTaskDelay(RTOS_PLANT_WATER);

		uint16_t moistureError = 0;
		uint32_t plantPumpOnTime = 0;

		static uint32_t PID_p, PID_i, PID_d, previousError = 0;

		/* PID calculation for how long to turn on water pump */
		if( ( xSemaphoreTake( Sensor_Sema_Handle, (TickType_t) 10 ) == pdTRUE ) && ( xSemaphoreTake ( Setpoint_Sema_Handle, (TickType_t) 10 ) == pdTRUE ) )
		{
			moistureError = ((ucPlantSensors[0] - ucMoistureSetpoint) > 0) ? (ucPlantSensors[0] - ucMoistureSetpoint) : 0;

			xSemaphoreGive(Sensor_Sema_Handle);
			xSemaphoreGive(Setpoint_Sema_Handle);
		}

		PID_p = moistureError * proportionCoeff;

		/* Integral control accumulates error -> helps to adjust for different pot sizes */
		PID_i = (moistureError > 100) ? (PID_i + moistureError * integralCoeff) : 0;

		/* Derivative control is proportional to the rate of change of the error */
		PID_d = (previousError != 0 && moistureError - previousError > 0) ? ((moistureError - previousError) * derivativeCoeff) : PID_d;

		previousError = moistureError;

		/* Check if the moisture error exceeds the tolerance */
		if( xSemaphoreTake ( Tolerance_Sema_Handle, (TickType_t) 10 ) == pdTRUE )
		{
			if( moistureError > ucMoistureTolerance )
			{
				plantPumpOnTime = min(MAX_PUMP_ON_TIME, PID_p + PID_d + PID_i);
			}

			xSemaphoreGive(Tolerance_Sema_Handle);
		}

		/* Water plant if on-time has a value */
		if( plantPumpOnTime > 0 )
		{
			/* Turn on BJT switch for pump and on-board LED */
			HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
			HAL_GPIO_WritePin(GPIOB, GPIO_PIN_7, GPIO_PIN_SET);
			vTaskDelay(plantPumpOnTime);
			HAL_GPIO_WritePin(GPIOB, GPIO_PIN_7, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
		}
	}
}

/**
* @brief If control data has been updated, update values in non-volatile memory.
* @param argument: Not used
* @retval None
*/
void Flash_Update( void *pvParameters )
{
	for(;;)
	{
		if( ucControlUpdateFlag == SET )
		{
			HAL_FLASH_Unlock();

			FLASH_Erase_Sector(FLASH_SECTOR_NUM, FLASH_VOLTAGE_RANGE_3);

			HAL_FLASH_Program(FLASH_TYPEPROGRAM_HALFWORD, FLASH_CONTROL_DATA_ADDR, (uint64_t)ucMoistureSetpoint);
			HAL_FLASH_Program(FLASH_TYPEPROGRAM_HALFWORD, FLASH_CONTROL_DATA_ADDR + 2, (uint64_t)ucMoistureTolerance);

			ucControlUpdateFlag = RESET;

			HAL_FLASH_Lock();
		}

		vTaskDelay(10000);
	}
}


/******************************************************************
**************** Interrupt routine callbacks **********************
*******************************************************************/

/* Called on completion of ADC readings from analog sensors */
void HAL_ADC_ConvCpltCallback( ADC_HandleTypeDef* pAdc1_sensorsRead )
{
	xSemaphoreGiveFromISR(Sensor_Sema_Handle, NULL);
}

/* SPI transmission callback - called when UpdateScreen() completes to update OLED display from buffer */
void HAL_SPI_TxCpltCallback( SPI_HandleTypeDef* pSpi2_oledWrite )
{
	SSD1306_Disp.state = SSD1306_STATE_READY;

	/*
	 * This callback is run during SSD1306_Init() before scheduler gets control
	 * thus, we must check that scheduler has control before any RTOS operations
	 */
	if( xTaskGetSchedulerState() == taskSCHEDULER_RUNNING )
	{
		/* Give semaphore held on OLED buffer */
		xSemaphoreGiveFromISR(Oled_Buffer_Sema_Handle, NULL);
	}
}

/* Received data from ESP8266 Master -> Read command and take appropriate action */
void HAL_I2C_SlaveRxCpltCallback( I2C_HandleTypeDef* I2c1_espComm )
{
	/* Turn on on-board LED for visual indication */
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, SET);

	/* Check command code sent */
	if( ucEspCmdCode == ESP_REQ_SENSOR_DATA )
	{
		/* Send soil moisture and light sensor data to ESP8266 (4 bytes) */
		if( xSemaphoreTakeFromISR ( Sensor_Sema_Handle, NULL ) == pdTRUE )
		{
			/* Transmit data to ESP8266 */
			HAL_I2C_Slave_Transmit(I2c1_espComm, (uint8_t*)ucPlantSensors, sizeof(ucPlantSensors)/sizeof(uint8_t), 2000);

			xSemaphoreGiveFromISR(Sensor_Sema_Handle, NULL);
		}
	}
	else if( ucEspCmdCode == ESP_SEND_MOIS_SETPOINT )
	{
		/* Read updated setpoint value */
		if(xSemaphoreTakeFromISR(Setpoint_Sema_Handle, NULL) == pdTRUE)
		{
			/* Transmit data to ESP8266 */
			HAL_I2C_Slave_Receive(I2c1_espComm, (uint8_t*)&ucMoistureSetpoint, 2, 2000);

			/* Set flag so setpoint will be updated in flash memory */
			ucControlUpdateFlag = SET;

			xSemaphoreGiveFromISR(Setpoint_Sema_Handle, NULL);
		}
	}
	else if( ucEspCmdCode == ESP_SEND_MOIS_TOLERANCE )
	{
		/* Read updated tolerance value */
		if( xSemaphoreTakeFromISR ( Tolerance_Sema_Handle, NULL ) == pdTRUE )
		{
			/* Transmit data to ESP8266 */
			HAL_I2C_Slave_Receive(I2c1_espComm, (uint8_t*)&ucMoistureTolerance, 2, 2000);

			/* Set flag so tolerance will be updated in flash memory */
			ucControlUpdateFlag = SET;

			xSemaphoreGiveFromISR(Tolerance_Sema_Handle, NULL);
		}
	}

	/* Turn off on-board LED */
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, RESET);

	/* Keep in slave receive mode - should always be listening for commands from ESP8266 */
	HAL_I2C_Slave_Receive_IT(I2c1_espComm, &ucEspCmdCode, 1);
}


/**
  * @brief  Period elapsed callback in non blocking mode
  * @note   This function is called  when TIM6 interrupt took place, inside
  * HAL_TIM_IRQHandler(). It makes a direct call to HAL_IncTick() to increment
  * a global variable "uwTick" used as application time base.
  * @param  htim : TIM handle
  * @retval None
  */
void HAL_TIM_PeriodElapsedCallback( TIM_HandleTypeDef *htim )
{
  /* USER CODE BEGIN Callback 0 */

  /* USER CODE END Callback 0 */
  if (htim->Instance == TIM6) {
    HAL_IncTick();
  }
  /* USER CODE BEGIN Callback 1 */

  /* USER CODE END Callback 1 */
}

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */

  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{ 
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     tex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/

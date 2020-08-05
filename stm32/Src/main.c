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
  * This software component is licensed by ST under Ultimate Liberty license
  * SLA0044, the "License"; You may not use this file except in compliance with
  * the License. You may obtain a copy of the License at:
  *                             www.st.com/SLA0044
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

/* SSD1306 SPI Drivers */
#include "ssd1306.h"
#include "fonts.h"

/* Plant bitmap for OLED display */
#include "bitmap.h"

/*******************************************************
********** Peripheral handles **************************
*******************************************************/

ADC_HandleTypeDef Adc1_sensorsRead;
I2C_HandleTypeDef I2c1_espComm;
SPI_HandleTypeDef Spi2_oledWrite;
UART_HandleTypeDef Uart2_debug;
DMA_HandleTypeDef DMA2_adc_pipe, DMA1_oled_pipe, DMA1_esp8266_pipe;

/*******************************************************
*********** Private variables **************************
*******************************************************/

/*	Buffer for raw plant metric sensors
*		Index 0 -> capacitive soil moisture
*		Index 1 -> Photoresistor voltage divider
*/
uint16_t plant_sensors[2];

/* Moisture control variables */
uint16_t moistureSetpoint;

/* Sum of moisture used to calculate PID response values */
int32_t moistureErrorSum = 0;

/* How far to let moisture drift from setpoint before watering */
uint16_t moistureTolerance = PID_TOLERANCE_DEFAULT;

/* PID controller coefficients (initalized to default values) */
int16_t proportionCoeff = PID_P_DEFAULT;
int16_t integralCoeff = (int16_t)PID_I_DEFAULT;
int16_t derivativeCoeff = PID_D_DEFAULT;

/* Data buffers for I2C from ESP8266 */
uint8_t espCmdCode;

/* Structure for SSD1306 handle */
SSD1306_t SSD1306_OledDisp;

/* Create semaphores */
SemaphoreHandle_t Oled_Buffer_Sema_Handle;
SemaphoreHandle_t Sensor_Sema_Handle;	
SemaphoreHandle_t Setpoint_Sema_Handle;
SemaphoreHandle_t Pid_Moisture_Toler_Handle;

/* Private function prototypes -----------------------------------------------*/

/*******************************************************
********** Initialization functions ********************
*******************************************************/

void SystemClock_Config(void);

static void MX_GPIO_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_ADC1_Init(void);
static void MX_SPI2_Init(void);
static void MX_I2C1_Init(void);

/*******************************************************
********** DMA functions *******************************
*******************************************************/

static void DMA1_Stream4_Init(void);
static void DMA1_Stream6_Init(void);
static void DMA2_Stream0_Init(void);

/*******************************************************
********** Thread functions ****************************
*******************************************************/

void OLED_Update(void *pvParameters);
void OLED_Bitmap_Flip(void *pvParameters);
void OLED_Write(void *pvParameters);
void Sensor_Read(void *pvParameters);
void Plant_Water(void *pvParameters);


/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{
  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_USART2_UART_Init();
  MX_ADC1_Init();
  MX_SPI2_Init();
  MX_I2C1_Init();

	DMA1_Stream4_Init();
	DMA1_Stream6_Init();
	DMA2_Stream0_Init();

  /* USER CODE BEGIN RTOS_MUTEX */
  /* add mutexes, ... */
  /* USER CODE END RTOS_MUTEX */

  /* USER CODE BEGIN RTOS_SEMAPHORES */
	
	Sensor_Sema_Handle = xSemaphoreCreateBinary();	
	Setpoint_Sema_Handle = xSemaphoreCreateBinary();
	Oled_Buffer_Sema_Handle = xSemaphoreCreateBinary();
	Pid_Moisture_Toler_Handle = xSemaphoreCreateBinary();

	/* Assert correct initialization of semaphores */
	configASSERT(Sensor_Sema_Handle && Setpoint_Sema_Handle && Oled_Buffer_Sema_Handle);
	
	/* Initialize semaphore by giving */
	xSemaphoreGive(Sensor_Sema_Handle);
	xSemaphoreGive(Setpoint_Sema_Handle);
	xSemaphoreGive(Oled_Buffer_Sema_Handle);
	xSemaphoreGive(Pid_Moisture_Toler_Handle);
	
  /* USER CODE END RTOS_SEMAPHORES */
	
	/* Initialize OLED display */
	if (SSD1306_Init() != SSD1306_OK)
  {
    Error_Handler();
  }
	
	/* Listen for commands from ESP I2C master */
	HAL_I2C_Slave_Receive_IT(&I2c1_espComm, &espCmdCode, 1);

  /*******************************************************
	********** Thread functions ****************************
	*******************************************************/
	
	/* Task handlers */
	TaskHandle_t OLED_Update_TaskHandle, OLED_Bitmap_Flip_TaskHandle, OLED_Write_TaskHandle, Sensor_Read_TaskHandle, Plant_Water_TaskHandle;
	
  /* Register tasks (each with 128 byte stack size) */
	xTaskCreate(OLED_Update, "OLED_Update_Disp", 32, NULL, 1, &OLED_Update_TaskHandle);
	xTaskCreate(OLED_Bitmap_Flip, "OLED_Bitmap_Flip", 32, NULL, 2, &OLED_Bitmap_Flip_TaskHandle);
	xTaskCreate(OLED_Write, "OLED_Write_Task", 32, NULL, 3, &OLED_Write_TaskHandle);
	xTaskCreate(Sensor_Read, "Sensor_Read_Task", 32, NULL, 6, &Sensor_Read_TaskHandle);	
	xTaskCreate(Plant_Water, "Plant_Water_Task", 32, NULL, 7, &Plant_Water_TaskHandle);

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
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLRCLK;
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

  /* USER CODE BEGIN ADC1_Init 0 */

  /* USER CODE END ADC1_Init 0 */

  ADC_ChannelConfTypeDef sConfig = {0};

  /* USER CODE BEGIN ADC1_Init 1 */

  /* USER CODE END ADC1_Init 1 */
  /** Configure the global features of the ADC (Clock, Resolution, Data Alignment and number of conversion) 
  */
  Adc1_sensorsRead.Instance = ADC1;
  Adc1_sensorsRead.Init.ClockPrescaler = ADC_CLOCK_SYNC_PCLK_DIV4;
  Adc1_sensorsRead.Init.Resolution = ADC_RESOLUTION_12B;
  Adc1_sensorsRead.Init.ScanConvMode = ENABLE;
  Adc1_sensorsRead.Init.ContinuousConvMode = DISABLE;
  Adc1_sensorsRead.Init.DiscontinuousConvMode = DISABLE;
  Adc1_sensorsRead.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_NONE;
  Adc1_sensorsRead.Init.ExternalTrigConv = ADC_SOFTWARE_START;
  Adc1_sensorsRead.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  Adc1_sensorsRead.Init.NbrOfConversion = 2;
  Adc1_sensorsRead.Init.DMAContinuousRequests = ENABLE;
  Adc1_sensorsRead.Init.EOCSelection = ADC_EOC_SINGLE_CONV;
	
	/* Associate DMA with ADC */
	Adc1_sensorsRead.DMA_Handle = &DMA2_adc_pipe;
	
  if (HAL_ADC_Init(&Adc1_sensorsRead) != HAL_OK)
  {
    Error_Handler();
  }
	
  /** First read soil moisture level from PA0 */
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = 1;
  sConfig.SamplingTime = ADC_SAMPLETIME_112CYCLES;
	
  if (HAL_ADC_ConfigChannel(&Adc1_sensorsRead, &sConfig) != HAL_OK)
  {
    Error_Handler();
  }
	
	/** Read light level from photoresistor circuit at PA1 */
  sConfig.Channel = ADC_CHANNEL_1;
  sConfig.Rank = 2;
  sConfig.SamplingTime = ADC_SAMPLETIME_112CYCLES;
	
  if (HAL_ADC_ConfigChannel(&Adc1_sensorsRead, &sConfig) != HAL_OK)
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

  /* USER CODE BEGIN I2C1_Init 0 */

  /* USER CODE END I2C1_Init 0 */

  /* USER CODE BEGIN I2C1_Init 1 */

  /* USER CODE END I2C1_Init 1 */
  I2c1_espComm.Instance = I2C1;
  I2c1_espComm.Init.ClockSpeed = 100000;
  I2c1_espComm.Init.DutyCycle = I2C_DUTYCYCLE_2;
  I2c1_espComm.Init.OwnAddress1 = STM32_I2C_ADDR;
  I2c1_espComm.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  I2c1_espComm.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  I2c1_espComm.Init.OwnAddress2 = 0;
  I2c1_espComm.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  I2c1_espComm.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
	
  if (HAL_I2C_Init(&I2c1_espComm) != HAL_OK)
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
  /* SPI2 parameter configuration*/
  Spi2_oledWrite.Instance = SPI2;
  Spi2_oledWrite.Init.Mode = SPI_MODE_MASTER;
  Spi2_oledWrite.Init.Direction = SPI_DIRECTION_1LINE;
  Spi2_oledWrite.Init.DataSize = SPI_DATASIZE_8BIT;
  Spi2_oledWrite.Init.CLKPolarity = SPI_POLARITY_LOW;
  Spi2_oledWrite.Init.CLKPhase = SPI_PHASE_1EDGE;
  Spi2_oledWrite.Init.NSS = SPI_NSS_HARD_OUTPUT;
  Spi2_oledWrite.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_8;
  Spi2_oledWrite.Init.FirstBit = SPI_FIRSTBIT_MSB;
  Spi2_oledWrite.Init.TIMode = SPI_TIMODE_DISABLE;
  Spi2_oledWrite.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
	
	/* Associate DMA1 Stream 4 */
	Spi2_oledWrite.hdmatx = &DMA1_oled_pipe;
	
  if (HAL_SPI_Init(&Spi2_oledWrite) != HAL_OK)
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
  Uart2_debug.Instance = USART2;
  Uart2_debug.Init.BaudRate = 14400;
  Uart2_debug.Init.WordLength = UART_WORDLENGTH_8B;
  Uart2_debug.Init.StopBits = UART_STOPBITS_1;
  Uart2_debug.Init.Parity = UART_PARITY_NONE;
  Uart2_debug.Init.Mode = UART_MODE_TX;
  Uart2_debug.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  Uart2_debug.Init.OverSampling = UART_OVERSAMPLING_16;
	
  if (HAL_UART_Init(&Uart2_debug) != HAL_OK)
  {
    Error_Handler();
  }
}


/**
  * @brief DMA1 Stream 4 for transferring SSD1306 OLED buffer data to SPI1 Tx
  * @param None
  * @retval None
  */
static void DMA1_Stream4_Init() {
	__HAL_RCC_DMA1_CLK_ENABLE();
	
	/*
	* Stream 4, channel 0 used to transfer SSD1306 buffer data to SPI1 TxBuffer
	*/
	DMA1_oled_pipe.Instance = DMA1_Stream4;
	DMA1_oled_pipe.Init.Channel = DMA_CHANNEL_0;
	DMA1_oled_pipe.Init.Direction = DMA_MEMORY_TO_PERIPH;
	DMA1_oled_pipe.Init.Mode = DMA_NORMAL;
	DMA1_oled_pipe.Init.PeriphInc = DMA_PINC_DISABLE;
	DMA1_oled_pipe.Init.MemInc = DMA_MINC_ENABLE;
	DMA1_oled_pipe.Init.MemBurst = DMA_MBURST_SINGLE;
	DMA1_oled_pipe.Init.PeriphBurst = DMA_PBURST_SINGLE;
	DMA1_oled_pipe.Init.FIFOMode = DMA_FIFOMODE_DISABLE;
	DMA1_oled_pipe.Init.MemDataAlignment = DMA_MDATAALIGN_BYTE;
	DMA1_oled_pipe.Init.PeriphDataAlignment = DMA_PDATAALIGN_BYTE;
	DMA1_oled_pipe.Init.Priority = DMA_PRIORITY_VERY_HIGH;

	/* Associate the SPI parent */
	DMA1_oled_pipe.Parent = &Spi2_oledWrite;
	
	if (HAL_DMA_Init(&DMA1_oled_pipe) != HAL_OK)
  {
    Error_Handler();
  }
	
	/* DMA1 stream 4 interrupt config */
	HAL_NVIC_SetPriority(DMA1_Stream4_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(DMA1_Stream4_IRQn);
}


/**
  * @brief DMA1 Stream 6 for transferring plant sensor data to ESP8266 via I2C1
  * @param None
  * @retval None
  */
static void DMA1_Stream6_Init() {
	__HAL_RCC_DMA1_CLK_ENABLE();
	
	/*
	* Stream 4, channel 0 used to transfer SSD1306 buffer data to SPI1 TxBuffer
	*/
	DMA1_esp8266_pipe.Instance = DMA1_Stream6;
	DMA1_esp8266_pipe.Init.Channel = DMA_CHANNEL_1;
	DMA1_esp8266_pipe.Init.Direction = DMA_MEMORY_TO_PERIPH;
	DMA1_esp8266_pipe.Init.Mode = DMA_NORMAL;
	DMA1_esp8266_pipe.Init.PeriphInc = DMA_PINC_DISABLE;
	DMA1_esp8266_pipe.Init.MemInc = DMA_MINC_ENABLE;
	DMA1_esp8266_pipe.Init.MemBurst = DMA_MBURST_SINGLE;
	DMA1_esp8266_pipe.Init.PeriphBurst = DMA_PBURST_SINGLE;
	DMA1_esp8266_pipe.Init.FIFOMode = DMA_FIFOMODE_DISABLE;
	DMA1_esp8266_pipe.Init.MemDataAlignment = DMA_MDATAALIGN_HALFWORD;
	DMA1_esp8266_pipe.Init.PeriphDataAlignment = DMA_MDATAALIGN_HALFWORD;
	DMA1_esp8266_pipe.Init.Priority = DMA_PRIORITY_VERY_HIGH;
	
	if (HAL_DMA_Init(&DMA1_esp8266_pipe) != HAL_OK)
  {
    Error_Handler();
  }
	
	/* DMA1 stream 4 interrupt config */
	HAL_NVIC_SetPriority(DMA1_Stream6_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(DMA1_Stream6_IRQn);
}


/**
  * @brief DMA2 Stream 0 to transfer data from ADC DR to sensor data variable
  * @param None
  * @retval None
  */
static void DMA2_Stream0_Init(void) {
	__HAL_RCC_DMA2_CLK_ENABLE();
	
	/*
	* Stream 0, channel 0 used to transfer ADC readings to data variable
	*/
	DMA2_adc_pipe.Instance = DMA2_Stream0;
	DMA2_adc_pipe.Init.Channel = DMA_CHANNEL_0;
	DMA2_adc_pipe.Init.Direction = DMA_PERIPH_TO_MEMORY;
	DMA2_adc_pipe.Init.Mode = DMA_NORMAL;
	DMA2_adc_pipe.Init.PeriphInc = DMA_PINC_DISABLE;
	DMA2_adc_pipe.Init.MemInc = DMA_MINC_ENABLE;
	DMA2_adc_pipe.Init.MemBurst = DMA_MBURST_SINGLE;
	DMA2_adc_pipe.Init.PeriphBurst = DMA_PBURST_SINGLE;
	DMA2_adc_pipe.Init.FIFOMode = DMA_FIFOMODE_DISABLE;
	DMA2_adc_pipe.Init.MemDataAlignment = DMA_MDATAALIGN_HALFWORD;
	DMA2_adc_pipe.Init.PeriphDataAlignment = DMA_PDATAALIGN_HALFWORD;
	DMA2_adc_pipe.Init.Priority = DMA_PRIORITY_MEDIUM;
	
	/* Associate the ADC1 parent */
	DMA2_adc_pipe.Parent = &Adc1_sensorsRead;
	
	if (HAL_DMA_Init(&DMA2_adc_pipe) != HAL_OK)
  {
    Error_Handler();
  }

	/* DMA2 stream 0 interrupt config */
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
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_7|GPIO_PIN_8, GPIO_PIN_RESET);

  /*Configure GPIO pins : PC5 PC6 PC7 PC8 */
  GPIO_InitStruct.Pin = GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_7|GPIO_PIN_8;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
	
	/* Configure PC13 as falling edge interrupt - triggered by on-board button press */
	GPIO_InitStruct.Pin = GPIO_PIN_13;
	GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
	GPIO_InitStruct.Pull = GPIO_NOPULL;
	GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
	HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
	
	/* EXTI interrupt for PC13 */
  HAL_NVIC_SetPriority(EXTI15_10_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
}


/**
  * @brief  Update the OLED screen by writing contents of the buffer.
  * @param  argument: Not used 
  * @retval None
  */
/* USER CODE END Header_OLED_Write */
void OLED_Update(void *pvParameters)
{
	for(;;)
	{
		xSemaphoreTake(Oled_Buffer_Sema_Handle, 0);
		SSD1306_UpdateScreen();

		vTaskDelay(RTOS_UPDATE_OLED_DISP);
	}
}


/**
  * @brief  Function implementing the Update_OLED thread.
  * @param  argument: Not used 
  * @retval None
  */
/* USER CODE END Header_OLED_Write */
void OLED_Write(void *pvParameters)
{
  /* USER CODE BEGIN 5 */
  /* Infinite loop */
  for(;;)
  {			
		static char soilMoistureDisp[20] = "Soil: ";
		static char lightLevelDisp[18] = "Light: ";
		
		if (xSemaphoreTake(Sensor_Sema_Handle, (TickType_t) 10) == pdTRUE)
		{
			sprintf(soilMoistureDisp + 6, "%i", plant_sensors[0]);
			sprintf(lightLevelDisp + 7, "%i", plant_sensors[1]);
			
			xSemaphoreGive(Sensor_Sema_Handle);
		}
		
		if (xSemaphoreTake(Oled_Buffer_Sema_Handle, (TickType_t) 10) == pdTRUE)
		{
			SSD1306_Fill_ToRight(50, SSD1306_PX_CLR_BLACK);
						
			SSD1306_GotoXY(50, 5);
			SSD1306_Puts(soilMoistureDisp, &Font_7x10, SSD1306_PX_CLR_WHITE);
			SSD1306_GotoXY(50, 21);
			SSD1306_Puts(lightLevelDisp, &Font_7x10, SSD1306_PX_CLR_WHITE);
			
			xSemaphoreGive(Oled_Buffer_Sema_Handle);
		}

		vTaskDelay(RTOS_OLED_WRITE_DISP);
  }
  /* USER CODE END 5 */ 
}


/**
  * @brief  Switch between the 2 bitmaps on OLED display.
  * @param  argument: Not used 
  * @retval None
  */
/* USER CODE END Header_OLED_Write */
void OLED_Bitmap_Flip(void *pvParameters)
{
	for(;;)
	{
		static bool sudoFlip = true;
		
		if (xSemaphoreTake(Oled_Buffer_Sema_Handle, (TickType_t)10) == pdTRUE)
		{
			SSD1306_DrawBitmap(0, 0, sudoFlip ? sudowoodopose1 : sudowoodopose2, 32, 32, SSD1306_PX_CLR_WHITE);
					
			sudoFlip = !sudoFlip;

			xSemaphoreGive(Oled_Buffer_Sema_Handle);
		}
		
		vTaskDelay(RTOS_OLED_BITMAP_FLIP);
	}

}

/**
* @brief Take analog readings from capacitive soil moisture sensor and photoresistor circuit.
* @param argument: Not used
* @retval None
*/
/* USER CODE END Header_Sensor_Read */
void Sensor_Read(void *pvParameters)
{
  /* USER CODE BEGIN Sensor_Read */
  /* Infinite loop */
  for(;;)
  {				
		/* Read value from ADCs into sensor value variables */
		if( xSemaphoreTake( Sensor_Sema_Handle, (TickType_t) 10 ) == pdTRUE  )
		{
			/* Read value from ADC1 at pin GPIO A0 */
			HAL_ADC_Start_DMA(&Adc1_sensorsRead, (uint32_t*)plant_sensors, 2);
		}
		
    vTaskDelay(RTOS_GET_SENSOR_DATA);
  }
  /* USER CODE END Sensor_Read */
}


/**
* @brief Compare soil moisture readings to setpoints and water plant if necessary.
* @param argument: Not used
* @retval None
*/
/* USER CODE END Header_Plant_Water */
void Plant_Water(void *pvParameters)
{
	for(;;) {
		int16_t moistureError = 0;
		int32_t PID_p, PID_i, PID_d;
		
		/* PID calculation for how long to turn on water pump */
		if(xSemaphoreTake(Sensor_Sema_Handle, (TickType_t) 10) == pdTRUE)
		{
			moistureError = plant_sensors[0] - moistureSetpoint;
			
			xSemaphoreGive(Sensor_Sema_Handle);
		}
		
		PID_p = moistureError * proportionCoeff;
		PID_d = (moistureError / RTOS_PLANT_WATER) * derivativeCoeff;
		PID_i = (moistureError > 50) ? (PID_i + moistureError * integralCoeff) : 0;
		
		if (moistureError > moistureTolerance)
		{
			int32_t plantPumpOnTime = PID_p + PID_d + PID_i;
		}

		vTaskDelay(RTOS_PLANT_WATER);
	}
}


/******************************************************************
**************** Interrupt routine callbacks **********************
*******************************************************************/

void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* pAdc1_sensorsRead) {	
	xSemaphoreGiveFromISR(Sensor_Sema_Handle, NULL);	
}
	

/* SPI transmission callback - called when UpdateScreen() completes to update OLED display from buffer */
void HAL_SPI_TxCpltCallback(SPI_HandleTypeDef* pSpi2_oledWrite) {
	SSD1306_OledDisp.state = SSD1306_STATE_READY;
	
	/* Give semaphore held on OLED buffer */
	xSemaphoreGiveFromISR(Oled_Buffer_Sema_Handle, NULL);
}

/* Received data from ESP8266 Master -> Read command and take appropriate action */
void HAL_I2C_SlaveRxCpltCallback(I2C_HandleTypeDef* I2c1_espComm) {	
	/* Check command code sent */	
	if (espCmdCode == ESP_REQ_SENSOR_DATA) {
		/* Send soil moisture and light sensor data to ESP8266 (4 bytes) */
		if(xSemaphoreTake(Sensor_Sema_Handle, portMAX_DELAY) == pdTRUE)
		{
			/* Read value from ADC1 at pin GPIO A0 */
			HAL_I2C_Slave_Transmit(I2c1_espComm, (uint8_t*)plant_sensors, sizeof(plant_sensors)/sizeof(uint8_t), 2000);
			
			xSemaphoreGive(Sensor_Sema_Handle);
		}
	}
	else if (espCmdCode == ESP_SEND_MOIS_SETPOINT) {		
		/* Take semaphore to update setpoint */
		if(xSemaphoreTake(Setpoint_Sema_Handle, portMAX_DELAY) == pdTRUE )
		{
			/* Read updated setpoint value */
			HAL_I2C_Slave_Receive(I2c1_espComm, (uint8_t*)&moistureSetpoint, 2, 2000);
			
			xSemaphoreGive(Setpoint_Sema_Handle);  
		}
	}
	else if (espCmdCode == ESP_SEND_MOIS_TOLERANCE) {
		/* Read updated tolerance value */
		if(xSemaphoreTake(Pid_Moisture_Toler_Handle, portMAX_DELAY) == pdTRUE )
		{
			/* Read updated setpoint value */
			HAL_I2C_Slave_Receive(I2c1_espComm, (uint8_t*)&moistureTolerance, 2, 2000);
			
			xSemaphoreGive(Pid_Moisture_Toler_Handle);  
		}
	}
	
	/* Keep in slave receive mode - should always be listening for commands from ESP8266 */
	HAL_I2C_Slave_Receive_IT(I2c1_espComm, &espCmdCode, 1);
}


 /**
  * @brief  Period elapsed callback in non blocking mode
  * @note   This function is called  when TIM6 interrupt took place, inside
  * HAL_TIM_IRQHandler(). It makes a direct call to HAL_IncTick() to increment
  * a global variable "uwTick" used as application time base.
  * @param  htim : TIM handle
  * @retval None
  */
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
  if (htim->Instance == TIM6) {
    HAL_IncTick();
  }
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

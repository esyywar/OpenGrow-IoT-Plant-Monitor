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
#include "cmsis_os.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* SSD1306 SPI Drivers */
#include "ssd1306.h"
#include "fonts.h"


/* Peripheral handle variables ---------------------------------------------------------*/
ADC_HandleTypeDef Adc1_sensorsRead;
I2C_HandleTypeDef I2c1_espComm;
SPI_HandleTypeDef Spi1_oledWrite;
UART_HandleTypeDef Uart2_debug;
DMA_HandleTypeDef DMA2_adc_pipe, DMA2_oled_pipe;

/* Private variables */
uint16_t moisture_sensors;

/* Structure for SSD1306 handle */
SSD1306_t SSD1306_OledDisp;

/* Definitions for Update_OLED */
osThreadId_t Update_OLEDHandle;
const osThreadAttr_t Update_OLED_attributes = {
  .name = "Update_OLED",
  .priority = (osPriority_t) osPriorityNormal,
  .stack_size = 128 * 4
};
/* Definitions for BlinkLED_02 */
osThreadId_t BlinkLED_02Handle;
const osThreadAttr_t BlinkLED_02_attributes = {
  .name = "BlinkLED_02",
  .priority = (osPriority_t) osPriorityBelowNormal7,
  .stack_size = 128 * 4
};
/* Definitions for BlinkLED_03 */
osThreadId_t BlinkLED_03Handle;
const osThreadAttr_t BlinkLED_03_attributes = {
  .name = "BlinkLED_03",
  .priority = (osPriority_t) osPriorityBelowNormal6,
  .stack_size = 128 * 4
};
/* Definitions for Get_Sensor_Data */
osThreadId_t Get_Sensor_DataHandle;
const osThreadAttr_t Get_Sensor_Data_attributes = {
  .name = "Get_Sensor_Data",
  .priority = (osPriority_t) osPriorityAboveNormal1,
  .stack_size = 128 * 4
};


/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);

static void MX_GPIO_Init(void);
static void MX_USART2_UART_Init(void);
static void MX_ADC1_Init(void);
static void MX_SPI1_Init(void);
static void MX_I2C1_Init(void);

/* DMA functions */
static void DMA2_Init(void);
static void DMA2_ADC1_Transfer_Cmplt_Callback(DMA_HandleTypeDef* pDMA2_adc_pipe);
static void DMA2_OLED_Transfer_Cmplt_Callback(DMA_HandleTypeDef* pDMA2_oled_pipe);

/* Thread functions */
void OLED_Write(void *argument);
void Blinky_02(void *argument);
void Blinky_03(void *argument);
void SensorRead(void *argument);


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
  MX_SPI1_Init();
  MX_I2C1_Init();

	DMA2_Init();
	
	/* Initialize OLED display */
	if (SSD1306_Init() != SSD1306_INIT_SUCCESS)
  {
    Error_Handler();
  }

  /* Init scheduler */
  osKernelInitialize();

  /* USER CODE BEGIN RTOS_MUTEX */
  /* add mutexes, ... */
  /* USER CODE END RTOS_MUTEX */

  /* USER CODE BEGIN RTOS_SEMAPHORES */
  /* add semaphores, ... */
  /* USER CODE END RTOS_SEMAPHORES */

  /* USER CODE BEGIN RTOS_TIMERS */
  /* start timers, add new ones, ... */
  /* USER CODE END RTOS_TIMERS */

  /* USER CODE BEGIN RTOS_QUEUES */
  /* add queues, ... */
  /* USER CODE END RTOS_QUEUES */

  /* Create the thread(s) */
  /* creation of Update_OLED */
  Update_OLEDHandle = osThreadNew(OLED_Write, NULL, &Update_OLED_attributes);

  /* creation of BlinkLED_02 */
  BlinkLED_02Handle = osThreadNew(Blinky_02, NULL, &BlinkLED_02_attributes);

  /* creation of BlinkLED_03 */
  BlinkLED_03Handle = osThreadNew(Blinky_03, NULL, &BlinkLED_03_attributes);

  /* creation of Get_Sensor_Data */
  Get_Sensor_DataHandle = osThreadNew(SensorRead, NULL, &Get_Sensor_Data_attributes);

  /* USER CODE BEGIN RTOS_THREADS */
  /* add threads, ... */
  /* USER CODE END RTOS_THREADS */

  /* Start scheduler */
  osKernelStart();
 
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
  Adc1_sensorsRead.Init.ScanConvMode = DISABLE;
  Adc1_sensorsRead.Init.ContinuousConvMode = DISABLE;
  Adc1_sensorsRead.Init.DiscontinuousConvMode = DISABLE;
  Adc1_sensorsRead.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_NONE;
  Adc1_sensorsRead.Init.ExternalTrigConv = ADC_SOFTWARE_START;
  Adc1_sensorsRead.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  Adc1_sensorsRead.Init.NbrOfConversion = 1;
  Adc1_sensorsRead.Init.DMAContinuousRequests = ENABLE;
  Adc1_sensorsRead.Init.EOCSelection = ADC_EOC_SINGLE_CONV;
	
  if (HAL_ADC_Init(&Adc1_sensorsRead) != HAL_OK)
  {
    Error_Handler();
  }
  /** Configure for the selected ADC regular channel its corresponding rank in the sequencer and its sample time. */
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = 1;
  sConfig.SamplingTime = ADC_SAMPLETIME_112CYCLES;
	
  if (HAL_ADC_ConfigChannel(&Adc1_sensorsRead, &sConfig) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN ADC1_Init 2 */

  /* USER CODE END ADC1_Init 2 */

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
  I2c1_espComm.Init.OwnAddress1 = 0;
  I2c1_espComm.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  I2c1_espComm.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  I2c1_espComm.Init.OwnAddress2 = 0;
  I2c1_espComm.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  I2c1_espComm.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&I2c1_espComm) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN I2C1_Init 2 */

  /* USER CODE END I2C1_Init 2 */

}

/**
  * @brief SPI1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_SPI1_Init(void)
{
  /* SPI1 parameter configuration*/
  Spi1_oledWrite.Instance = SPI1;
  Spi1_oledWrite.Init.Mode = SPI_MODE_MASTER;
  Spi1_oledWrite.Init.Direction = SPI_DIRECTION_1LINE;
  Spi1_oledWrite.Init.DataSize = SPI_DATASIZE_8BIT;
  Spi1_oledWrite.Init.CLKPolarity = SPI_POLARITY_LOW;
  Spi1_oledWrite.Init.CLKPhase = SPI_PHASE_1EDGE;
  Spi1_oledWrite.Init.NSS = SPI_NSS_HARD_OUTPUT;
  Spi1_oledWrite.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_16;
  Spi1_oledWrite.Init.FirstBit = SPI_FIRSTBIT_MSB;
  Spi1_oledWrite.Init.TIMode = SPI_TIMODE_DISABLE;
  Spi1_oledWrite.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
  Spi1_oledWrite.Init.CRCPolynomial = 10;
	
  if (HAL_SPI_Init(&Spi1_oledWrite) != HAL_OK)
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

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
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
  * @brief DMA2 Initialization Function
  * @param None
  * @retval None
  */
static void DMA2_Init(void) {
	__HAL_RCC_DMA2_CLK_ENABLE();
	
	/*
	* Stream 0, channel 0 used to transfer ADC readings to data variable
	*/
	DMA2_adc_pipe.Instance = DMA2_Stream0;
	DMA2_adc_pipe.Init.Channel = DMA_CHANNEL_0;
	DMA2_adc_pipe.Init.Direction = DMA_PERIPH_TO_MEMORY;
	DMA2_adc_pipe.Init.Mode = DMA_NORMAL;
	DMA2_adc_pipe.Init.PeriphInc = DMA_PINC_DISABLE;
	DMA2_adc_pipe.Init.MemInc = DMA_MINC_DISABLE;
	DMA2_adc_pipe.Init.MemBurst = DMA_MBURST_SINGLE;
	DMA2_adc_pipe.Init.PeriphBurst = DMA_PBURST_SINGLE;
	DMA2_adc_pipe.Init.FIFOMode = DMA_FIFOMODE_DISABLE;
	DMA2_adc_pipe.Init.MemDataAlignment = DMA_MDATAALIGN_HALFWORD;
	DMA2_adc_pipe.Init.PeriphDataAlignment = DMA_PDATAALIGN_HALFWORD;
	DMA2_adc_pipe.Init.Priority = DMA_PRIORITY_MEDIUM;
	DMA2_adc_pipe.XferCpltCallback = &DMA2_ADC1_Transfer_Cmplt_Callback;
	
	if (HAL_DMA_Init(&DMA2_adc_pipe) != HAL_OK)
  {
    Error_Handler();
  }
	
	/*
	* Stream 3, channel 3 used to transfer SSD1306 buffer data to SPI1 TxBuffer
	*/
	DMA2_oled_pipe.Init.Channel = DMA_CHANNEL_0;
	DMA2_oled_pipe.Init.Direction = DMA_MEMORY_TO_PERIPH;
	DMA2_oled_pipe.Init.Mode = DMA_NORMAL;
	DMA2_oled_pipe.Init.PeriphInc = DMA_PINC_DISABLE;
	DMA2_oled_pipe.Init.MemInc = DMA_MINC_ENABLE;
	DMA2_oled_pipe.Init.MemBurst = DMA_MBURST_SINGLE;
	DMA2_oled_pipe.Init.PeriphBurst = DMA_PBURST_SINGLE;
	DMA2_oled_pipe.Init.FIFOMode = DMA_FIFOMODE_DISABLE;
	DMA2_oled_pipe.Init.MemDataAlignment = DMA_MDATAALIGN_BYTE;
	DMA2_oled_pipe.Init.PeriphDataAlignment = DMA_PDATAALIGN_BYTE;
	DMA2_oled_pipe.Init.Priority = DMA_PRIORITY_VERY_HIGH;
	DMA2_oled_pipe.XferCpltCallback = &DMA2_OLED_Transfer_Cmplt_Callback;
	
	/* DMA2 stream 0 interrupt config */
  HAL_NVIC_SetPriority(DMA2_Stream0_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(DMA2_Stream0_IRQn);
	
	/* DMA2 stream 3 interrupt config */
	HAL_NVIC_SetPriority(DMA2_Stream3_IRQn, 5, 0);
  HAL_NVIC_EnableIRQ(DMA2_Stream3_IRQn);
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
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_8, GPIO_PIN_RESET);

  /*Configure GPIO pins : PC5 PC6 PC8 */
  GPIO_InitStruct.Pin = GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_8;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}


/**
  * @brief  Function implementing the Update_OLED thread.
  * @param  argument: Not used 
  * @retval None
  */
/* USER CODE END Header_OLED_Write */
void OLED_Write(void *argument)
{
  /* USER CODE BEGIN 5 */
  /* Infinite loop */
  for(;;)
  {
		osDelay(1);
  }
  /* USER CODE END 5 */ 
}


/**
* @brief Function implementing the BlinkLED_02 thread.
* @param argument: Not used
* @retval None
*/
/* USER CODE END Header_Blinky_02 */
void Blinky_02(void *argument)
{
  /* USER CODE BEGIN Blinky_02 */
  /* Infinite loop */
  for(;;)
  {
		HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_5);
    osDelay(250);
  }
  /* USER CODE END Blinky_02 */
}


/**
* @brief Function implementing the BlinkLED_03 thread.
* @param argument: Not used
* @retval None
*/
/* USER CODE END Header_Blinky_03 */
void Blinky_03(void *argument)
{
  /* USER CODE BEGIN Blinky_03 */
  /* Infinite loop */
  for(;;)
  {
    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_6);
    osDelay(1000);
  }
  /* USER CODE END Blinky_03 */
}


/**
* @brief Function implementing the Get_Sensor_Data thread.
* @param argument: Not used
* @retval None
*/
/* USER CODE END Header_SensorRead */
void SensorRead(void *argument)
{
  /* USER CODE BEGIN SensorRead */
  /* Infinite loop */
  for(;;)
  {
		/* Set DMA to transfer from ADC to data buffer */
		HAL_DMA_Start_IT(&DMA2_adc_pipe, (uint32_t)&(ADC1->DR), (uint32_t)&moisture_sensors, 1);
		
		/* Read value from ADC1 at pin GPIO A0 */
		HAL_ADC_Start_DMA(&Adc1_sensorsRead, (uint32_t*)&moisture_sensors, 1);
		
    osDelay(1000);
  }
  /* USER CODE END SensorRead */
}



/********************** Interrupt routine callbacks *****************************/

/* DMA transfer compelte callback - Now send data by USART2 */
static void DMA2_ADC1_Transfer_Cmplt_Callback(DMA_HandleTypeDef* pDMA2_adc_pipe) {
	HAL_ADC_Stop_DMA(&Adc1_sensorsRead);
	
	/* Write data out from UART2 (for debug purposes) */
	char output[50];
	sprintf(output, "%i\r\n", moisture_sensors);
	
	HAL_UART_Transmit_IT(&Uart2_debug, (uint8_t*)output, strlen(output));
}

static void DMA2_OLED_Transfer_Cmplt_Callback(DMA_HandleTypeDef* pDMA2_oled_pipe) {
	// Implement oled finish transfer code
	SSD1306_OledDisp.state = SSD1306_STATE_READY;
	
	// TODO
	// Release mutex / binary semaphore here
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

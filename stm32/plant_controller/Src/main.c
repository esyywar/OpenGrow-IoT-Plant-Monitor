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

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */

/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
/* Definitions for BlinkLED_01 */
osThreadId_t BlinkLED_01Handle;
const osThreadAttr_t BlinkLED_01_attributes = {
  .name = "BlinkLED_01",
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
/* Definitions for BlinkLED_04 */
osThreadId_t BlinkLED_04Handle;
const osThreadAttr_t BlinkLED_04_attributes = {
  .name = "BlinkLED_04",
  .priority = (osPriority_t) osPriorityBelowNormal5,
  .stack_size = 128 * 4
};
/* USER CODE BEGIN PV */

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
void Blinky_01(void *argument);
void Blinky_02(void *argument);
void Blinky_03(void *argument);
void Blinky_04(void *argument);

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
  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  /* USER CODE BEGIN 2 */

  /* USER CODE END 2 */

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
  /* creation of BlinkLED_01 */
  BlinkLED_01Handle = osThreadNew(Blinky_01, NULL, &BlinkLED_01_attributes);

  /* creation of BlinkLED_02 */
  BlinkLED_02Handle = osThreadNew(Blinky_02, NULL, &BlinkLED_02_attributes);

  /* creation of BlinkLED_03 */
  BlinkLED_03Handle = osThreadNew(Blinky_03, NULL, &BlinkLED_03_attributes);

  /* creation of BlinkLED_04 */
  BlinkLED_04Handle = osThreadNew(Blinky_04, NULL, &BlinkLED_04_attributes);

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
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE3);
  /** Initializes the CPU, AHB and APB busses clocks 
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_NONE;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }
  /** Initializes the CPU, AHB and APB busses clocks 
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_HSI;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_0) != HAL_OK)
  {
    Error_Handler();
  }
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

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_8, GPIO_PIN_RESET);

  /*Configure GPIO pin : PA5 */
  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_MEDIUM;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /*Configure GPIO pins : PC5 PC6 PC8 */
  GPIO_InitStruct.Pin = GPIO_PIN_5|GPIO_PIN_6|GPIO_PIN_8;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_MEDIUM;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

}

/* USER CODE BEGIN 4 */

/* USER CODE END 4 */

/* USER CODE BEGIN Header_Blinky_01 */
/**
  * @brief  Function implementing the BlinkLED_01 thread.
  * @param  argument: Not used 
  * @retval None
  */
/* USER CODE END Header_Blinky_01 */
void Blinky_01(void *argument)
{
  /* USER CODE BEGIN 5 */
  /* Infinite loop */
  for(;;)
  {
		HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    osDelay(1000);
  }
  /* USER CODE END 5 */ 
	osThreadTerminate(argument);
}

/* USER CODE BEGIN Header_Blinky_02 */
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
	osThreadTerminate(argument);
}

/* USER CODE BEGIN Header_Blinky_03 */
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
    osDelay(750);
  }
  /* USER CODE END Blinky_03 */
	osThreadTerminate(argument);
}

/* USER CODE BEGIN Header_Blinky_04 */
/**
* @brief Function implementing the BlinkLED_04 thread.
* @param argument: Not used
* @retval None
*/
/* USER CODE END Header_Blinky_04 */
void Blinky_04(void *argument)
{
  /* USER CODE BEGIN Blinky_04 */
  /* Infinite loop */
  for(;;)
  {
    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_8);
    osDelay(1500);
  }
  /* USER CODE END Blinky_04 */
	osThreadTerminate(argument);
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

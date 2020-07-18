/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.h
  * @brief          : Header for main.c file.
  *                   This file contains the common defines of the application.
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

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __MAIN_H
#define __MAIN_H

#ifdef __cplusplus
extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include "stm32f4xx_hal.h"

/* Private includes ----------------------------------------------------------*/

/* I2C device addresses 
*	 Note: Hal driver shifts the address right -> compensate by left shift
*/
#define STM32_I2C_ADDR						0x68 << 1		
#define ESP8266_I2C_ADDR					0x5C << 1

/* I2C commands */

/* For Arduino I2C tests */
#define SEND_LENGTH_CMD						0x51
#define SEND_DATA_CMD							0x52

#define ESP_REQ_SENSOR_DATA				0x42
#define ESP_SEND_SETPOINT_LOW			0x44
#define ESP_SEND_SETPOINT_HIGH		0x46

/* Timing configurations */
#define RTOS_UPDATE_OLED_DISP			100U		
#define RTOS_OLED_WRITE_DISP			200U
#define RTOS_SEND_ESP_DATA				1000U
#define RTOS_GET_SENSOR_DATA			1000U

/* Exported types ------------------------------------------------------------*/
/* USER CODE BEGIN ET */

/* USER CODE END ET */

/* Exported constants --------------------------------------------------------*/
/* USER CODE BEGIN EC */

/* USER CODE END EC */

/* Exported macro ------------------------------------------------------------*/
/* USER CODE BEGIN EM */

/* USER CODE END EM */

/* Exported functions prototypes ---------------------------------------------*/
void Error_Handler(void);

/* USER CODE BEGIN EFP */

/* USER CODE END EFP */

/* Private defines -----------------------------------------------------------*/
/* USER CODE BEGIN Private defines */

/* USER CODE END Private defines */

#ifdef __cplusplus
}
#endif

#endif /* __MAIN_H */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/

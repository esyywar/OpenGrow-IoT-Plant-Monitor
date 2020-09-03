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
  * This software component is licensed by ST under BSD 3-Clause license,
  * the "License"; You may not use this file except in compliance with the
  * License. You may obtain a copy of the License at:
  *                        opensource.org/licenses/BSD-3-Clause
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

/*******************************************************
******************* I2C Settings ***********************
*******************************************************/

#define STM32_I2C_ADDR					0x68 << 1

/* I2C commands */
#define ESP_REQ_SENSOR_DATA				0x51
#define ESP_SEND_MOIS_SETPOINT			0x44
#define ESP_SEND_MOIS_TOLERANCE			0x46

/*******************************************************
******************* RTOS Timings ***********************
*******************************************************/

/* RTOS thread timing settings */
#define RTOS_UPDATE_OLED_DISP			50U
#define RTOS_OLED_BITMAP_FLIP			1000U
#define RTOS_OLED_WRITE_DISP			700U
#define RTOS_SEND_ESP_DATA				1000U
#define RTOS_GET_SENSOR_DATA			1000U
#define RTOS_PLANT_WATER				300000U

/*******************************************************
************* Plant Watering Controls ******************
*******************************************************/

/* Plant water pump water settings (to be optimized) */
#define PID_P_DEFAULT					80
#define PID_I_DEFAULT					8
#define PID_D_DEFAULT					15

/* On-time required for pump to bring water to plant (default) */
#define PLANT_SETPOINT_DEFAULT			2000U
#define PLANT_TOLERANCE_DEFAULT			300U

/*******************************************************
*************** Flash Memory Settings ******************
*******************************************************/

#define FLASH_SECTOR_NUM				7U
#define FLASH_CONTROL_DATA_ADDR			0x08060000UL


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

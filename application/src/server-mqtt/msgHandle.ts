/*
 *	MQTT Subscribe and handle messages from backend
 *
 *		Subscriber will find registered plants in the database and subscribe to these topics
 *		Received data will be saved to the database as required
 */

import { IPlant } from '../models/Plant'

/* Record soil moisture value in database */
export const soilDataReceived = async (plant: IPlant, soilMoisture: number) => {
	console.log('Publishing to soil: ' + soilMoisture)
	const currDate = new Date()

	try {
		/* If first entry in data array -> record and return */
		if (!(plant.data.soilMoisture.length > 0)) {
			plant.data.soilMoisture.push({ measurement: soilMoisture, date: currDate })
			await plant.save()
			return
		}

		const lastEntryMin = plant.data.soilMoisture.slice(-1)[0].date?.getMinutes()

		/* Check that new data is at least 5 minutes from previous entry */
		if (!lastEntryMin || Math.abs(currDate.getMinutes() - lastEntryMin) >= 5) {
			plant.data.soilMoisture.push({ measurement: soilMoisture, date: currDate })
			await plant.save()
		}
	} catch (error) {
		console.log(error)
	}
}

/* Record light level value in database */
export const lightDataReceived = async (plant: IPlant, lightLevel: number) => {
	console.log('Publishing to light: ' + lightLevel)
	const currDate = new Date()

	try {
		/* If first entry in data array -> record and return */
		if (!(plant.data.lightLevel.length > 0)) {
			plant.data.lightLevel.push({ measurement: lightLevel, date: currDate })
			await plant.save()
			return
		}

		const lastEntryMin = plant.data.lightLevel.slice(-1)[0].date?.getMinutes()

		/* Check that new data is at least 5 minutes from previous entry */
		if (!lastEntryMin || Math.abs(currDate.getMinutes() - lastEntryMin) >= 5) {
			plant.data.lightLevel.push({ measurement: lightLevel, date: currDate })
			await plant.save()
		}
	} catch (error) {
		console.log(error)
	}
}

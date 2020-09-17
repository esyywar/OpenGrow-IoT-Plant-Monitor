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

		const lastEntryTime = plant.data.soilMoisture.slice(-1)[0].date?.getTime()

		/* Check that new data is at least 5 minutes from previous entry */
		if (!lastEntryTime || currDate.getTime() - lastEntryTime >= 300000) {
			plant.data.soilMoisture.push({ measurement: soilMoisture, date: currDate })

			/* Max number of entries to store is 3 weeks (6048 points if every 5 min for 3 weeks) */
			if (plant.data.soilMoisture.length >= 6048) {
				plant.data.soilMoisture.shift()
			}

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

		const lastEntryTime = plant.data.lightLevel.slice(-1)[0].date?.getTime()

		/* Check that new data is at least 5 minutes from previous entry */
		if (!lastEntryTime || currDate.getTime() - lastEntryTime >= 300000) {
			plant.data.lightLevel.push({ measurement: lightLevel, date: currDate })

			/* Max number of entries to store is 3 weeks (6048 points if every 5 min for 3 weeks) */
			if (plant.data.lightLevel.length >= 6048) {
				plant.data.lightLevel.shift()
			}

			await plant.save()
		}
	} catch (error) {
		console.log(error)
	}
}

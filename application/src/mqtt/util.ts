/* Plant variables */
export enum plantVarEnum {
	soilMoisture = 'soilmoisture',
	lightLevel = 'light',
}

/* Get plantId from topic */
export const getPlantIdFromTopic = (topic: string) => {
	return topic.split('/')[0]
}

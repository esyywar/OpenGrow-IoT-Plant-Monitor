/* Plant variables */
export enum plantVarEnum {
	soilMoisture = 'soilmoisture',
	lightLevel = 'light',
}

/* Get plantId from topic */
export const getPlantIdFromTopic = (topic: string) => {
	return topic.split('/')[0]
}

/* Get message type from topic */
export const getMsgTypeFromTopic = (topic: string) => {
	return topic.split('/')[1]
}

/* Get plant variable from topic */
export const getPlantVarFromTopic = (topic: string) => {
	return topic.split('/')[2]
}

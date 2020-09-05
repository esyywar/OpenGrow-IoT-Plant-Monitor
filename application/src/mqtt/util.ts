/* High and low bytes packet sent from ESP */
export type espPlantDataType = {
	highByte: number
	lowByte: number
}

/* Plant metrics */
export enum plantMetricEnum {
	soilMoisture = 'soilMoisture',
	lightLevel = 'lightLevel',
}

/* Get plantId from topic */
export const getPlantIdFromTopic = (topic: string) => {
	return topic.split('/')[0]
}

/* Get plant metric type from topic */
export const getMetricFromTopic = (topic: string) => {
	return topic.split('/')[1]
}

/* Convert 2 bytes into a 16 bit integer */
export const intFromBytes = (highByte: number, lowByte: number) => {
	return (highByte << 8) | (lowByte & 0xff)
}

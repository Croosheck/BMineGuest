import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

export async function calendar() {
	const { status } = await Calendar.requestCalendarPermissionsAsync();
	return status;
}

export async function reminder() {
	if (Platform.OS === "ios") {
		const { status } = await Calendar.requestRemindersPermissionsAsync();
		return status;
	} else return;
}

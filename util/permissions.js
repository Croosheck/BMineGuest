import {
	requestCalendarPermissionsAsync,
	requestRemindersPermissionsAsync,
} from "expo-calendar";
import { Platform } from "react-native";

export async function calendar() {
	const { granted } = await requestCalendarPermissionsAsync();
	return granted;
}

export async function reminder() {
	if (Platform.OS === "ios") {
		const { status } = await requestRemindersPermissionsAsync();
		return status;
	}
}

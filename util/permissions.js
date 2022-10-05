import * as Calendar from "expo-calendar";

export async function calendar() {
	const { status } = await Calendar.requestCalendarPermissionsAsync();
	if (status === "granted") {
		const calendars = await Calendar.getCalendarsAsync(
			Calendar.EntityTypes.EVENT
		);
		console.log("Here are all your calendars:");
		console.log({ calendars });
	}
}

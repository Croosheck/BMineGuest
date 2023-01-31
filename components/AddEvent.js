import { Alert, Platform } from "react-native";

import * as SystemCalendar from "expo-calendar";
import { reminder } from "../util/permissions";

export const addEvent = (eventDate, restaurantName) => {
	let permissionReminderStatus;

	async function permissionsStatus() {
		//only ios
		permissionReminderStatus = await reminder();
	}
	if (Platform.OS === "ios") {
		permissionsStatus();
	}

	async function getDefaultCalendarSource() {
		const defaultCalendar = await SystemCalendar.getDefaultCalendarAsync();
		return defaultCalendar.source;
	}

	async function createCalendar() {
		if (Platform.OS === "ios" && permissionReminderStatus !== "granted") {
			Alert.alert("Access denied!", "No permission to use Your calendar.");
			return;
		}

		const defaultCalendarSource =
			Platform.OS === "ios"
				? await getDefaultCalendarSource()
				: { isLocalAccount: true, name: "BMineGuestCalendar" };

		const calendars = await SystemCalendar.getCalendarsAsync(
			SystemCalendar.EntityTypes.EVENT
		);
		const isCalendarExisting = calendars.some(
			(item) => item.source.name === "BMineGuestCalendar"
		);

		// Picks an existing calendar, if option has been used already
		if (isCalendarExisting) {
			const reservationsCalendar = calendars.find(
				(item) => item.source.name === "BMineGuestCalendar"
			);

			const existingCalendarID = reservationsCalendar.id;

			return existingCalendarID;
		}

		// Creates new calendar, if option has has been used for the 1st time
		const newCalendarID = await SystemCalendar.createCalendarAsync({
			title: "BMineGuestCalendar",
			color: "blue",
			entityType: SystemCalendar.EntityTypes.EVENT,
			sourceId: defaultCalendarSource.id,
			source: defaultCalendarSource,
			name: "internalCalendarName",
			ownerAccount: "personal",
			accessLevel: SystemCalendar.CalendarAccessLevel.OWNER,
		});

		return newCalendarID;
	}

	const addNewEvent = async () => {
		try {
			const calendarId = await createCalendar();

			// Adds new event to phone calendar
			const res = await SystemCalendar.createEventAsync(calendarId, {
				endDate: new Date(eventDate),
				startDate: new Date(eventDate),
				title: `Restaurant reservation in ${restaurantName}`,
				creationDate: new Date(Date.now()),
				alarms: [
					{
						// Reminder offset (in minutes)
						relativeOffset: -180,
						method: SystemCalendar.AlarmMethod.ALERT,
					},
				],
			});

			Alert.alert(
				"Success!",
				"Your reservation has been added to the phone calendar."
			);
		} catch (e) {
			console.log(e);
		}
	};

	addNewEvent();
};

import { StyleSheet, View, Button, Alert, Platform } from "react-native";

import { useDispatch } from "react-redux";
import { clearDate } from "../redux/slices/user";

import * as SystemCalendar from "expo-calendar";
import { useEffect } from "react";

const AddEvent = ({ eventDate }) => {
	const dispatch = useDispatch();

	let permissionReminderStatus;

	useEffect(() => {
		async function permissionsStatus() {
			//only ios
			permissionReminderStatus = await reminder();
		}
		if (Platform.OS === "ios") {
			permissionsStatus();
		}
	});

	async function getDefaultCalendarSource() {
		const defaultCalendar = await SystemCalendar.getDefaultCalendarAsync();
		return defaultCalendar.source;
	}

	async function createCalendar() {
		// if (permissionReminderStatus !== "granted") {
		// 	Alert.alert("Access denied!", "No permission to use Your calendar.");
		// 	return;
		// }

		const defaultCalendarSource =
			Platform.OS === "ios"
				? await getDefaultCalendarSource()
				: { isLocalAccount: true, name: "Restaurant Reservation" };
		const newCalendarID = await SystemCalendar.createCalendarAsync({
			title: "Reservations Calendar",
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

			const res = await SystemCalendar.createEventAsync(calendarId, {
				endDate: new Date(eventDate),
				startDate: new Date(eventDate),
				title: `Restaurant Reservation`,
				alarms: [
					{
						// Reminder offset (in minutes)
						relativeOffset: -120,
						method: SystemCalendar.AlarmMethod.ALERT,
					},
				],
			});
			Alert.alert(
				"Success!",
				"Your reservation has been added to Your calendar."
			);
			dispatch(clearDate());
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View style={styles.container}>
			<Button title="Add to Your calendar!" onPress={addNewEvent} />
		</View>
	);
};

export default AddEvent;

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
});

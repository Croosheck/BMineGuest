import { StyleSheet, View, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { clearDate } from "../redux/slices/user";

import * as SystemCalendar from "expo-calendar";

const AddEvent = ({ eventDate }) => {
	const dispatch = useDispatch();

	async function getDefaultCalendarSource() {
		const defaultCalendar = await SystemCalendar.getDefaultCalendarAsync();
		return defaultCalendar.source;
	}

	async function createCalendar() {
		const defaultCalendarSource =
			Platform.OS === "ios"
				? await getDefaultCalendarSource()
				: { isLocalAccount: true, name: "Expo Calendar" };
		const newCalendarID = await SystemCalendar.createCalendarAsync({
			title: "Expo Calendar",
			color: "blue",
			entityType: SystemCalendar.EntityTypes.EVENT,
			sourceId: defaultCalendarSource.id,
			source: defaultCalendarSource,
			name: "internalCalendarName",
			ownerAccount: "personal",
			accessLevel: SystemCalendar.CalendarAccessLevel.OWNER,
		});
		console.log(`Your new calendar ID is: ${newCalendarID}`);
		return newCalendarID;
	}

	const addNewEvent = async () => {
		try {
			const calendarId = await createCalendar();

			const res = await SystemCalendar.createEventAsync(calendarId, {
				endDate: new Date(eventDate),
				startDate: new Date(eventDate),
				title: `Test event: ${eventDate}`,
			});
			Alert.alert("Success!", "Event Created.");
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

const styles = StyleSheet.create({});

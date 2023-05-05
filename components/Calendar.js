import { useEffect } from "react";
import { Alert, View, StyleSheet } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useDispatch } from "react-redux";
import { pickDate, pickDateParameters } from "../redux/slices/user";
import { calendar } from "../util/permissions";

const Calendar = ({
	openDays = [],
	closestReservationTimestamp = Number(),
	hideDatePicker = () => {},
	isDatePickerVisible = false,
}) => {
	const dispatch = useDispatch();

	let permissionCalendarStatus;

	// Request permissios to use system calendar (read and write)
	useEffect(() => {
		async function permissionsStatus() {
			const permissionStatus = await calendar();
			return permissionStatus;
		}
		permissionCalendarStatus = permissionsStatus();

		if (!permissionCalendarStatus) {
			return Alert.alert(
				"Access denied!",
				"No permission to use Your calendar."
			);
		}
	}, []);

	const alertButtons = [
		{
			text: "Ok",
			onPress: hideDatePicker,
		},
	];

	function handleConfirm(date) {
		const timestamp = new Date(date).valueOf();

		const pickedDayWeekDayNumber = new Date(timestamp).getDay();
		const pickedDayHours = new Date(timestamp).getHours();
		const pickedDayMinutes = new Date(timestamp).getMinutes();

		const pickedDay = openDays.find(
			(item) => item.day === pickedDayWeekDayNumber
		);

		const upperCaseDay =
			pickedDay.dayLong.slice(0, 1).toUpperCase() + pickedDay.dayLong.slice(1);

		if (!pickedDay.isOpen) {
			Alert.alert(
				`Reservations are unavailable every ${upperCaseDay}`,
				"You can still try picking another day!",
				alertButtons
			);
			hideDatePicker();
			return;
		}

		const nowTimestamp = Date.now();

		//future dates only
		const todaysHourCheck = timestamp > nowTimestamp;

		const hoursCheck =
			pickedDayHours >= pickedDay.hours.reservationsOpen &&
			pickedDayHours < pickedDay.hours.reservationsClose &&
			todaysHourCheck;

		if (!todaysHourCheck) {
			Alert.alert(
				`Not able to place reservation for ${pickedDayHours}:${String(
					pickedDayMinutes
				).padStart(2, "0")}.`,
				`Unfortunately, our time travel machine is broken :(`,
				alertButtons
			);
			hideDatePicker();
			return;
		}

		if (!hoursCheck) {
			Alert.alert(
				`Not able to place reservation for ${pickedDayHours}:${String(
					pickedDayMinutes
				).padStart(2, "0")}.`,
				`Every ${upperCaseDay}, you can pick your reservation time between ${String(
					pickedDay.hours.reservationsOpen
				).padStart(2, "0")}:00-${String(
					pickedDay.hours.reservationsClose
				).padStart(2, "0")}:00`,
				alertButtons
			);
			hideDatePicker();
			return;
		}

		if (hoursCheck) {
			const dateParams = {
				year: new Date(timestamp).getFullYear(),
				month: new Date(timestamp).getMonth(),
				day: new Date(timestamp).getDate(),
				hours: new Date(timestamp).getHours(),
				minutes: new Date(timestamp).getMinutes(),
				weekdayNumber: new Date(timestamp).getDay(),
			};

			Alert.alert(
				"Good choice!",
				"Switch tabs and tell us more about your reservation!",
				alertButtons
			);
			hideDatePicker();
			dispatch(pickDate(timestamp));
			dispatch(pickDateParameters(dateParams));
			return;
		}
		hideDatePicker();
	}

	return (
		<View style={styles.container}>
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="datetime"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
				hideDatePicker={hideDatePicker}
				date={new Date(closestReservationTimestamp)}
				minimumDate={new Date(closestReservationTimestamp)}
				minuteInterval={5}
				is24Hour
				positiveButton={{ label: "OK!", textColor: "#C9792E" }}
			/>
		</View>
	);
};

export default Calendar;

const styles = StyleSheet.create({
	container: {},
	closestDateInfo: {
		color: "#ffffff",
		marginBottom: 44,
	},
});

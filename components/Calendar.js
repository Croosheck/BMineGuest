import { useEffect, useState } from "react";
import { Alert, Button, View, Text, StyleSheet } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useDispatch } from "react-redux";
import { pickDate } from "../redux/slices/user";
import { formatDate } from "../util/dateFormat";
import { calendar, reminder } from "../util/permissions";

const MS_PER_HOUR = 3600000;

const Calendar = ({
	reservationAdvance,
	openDays,
	closestReservationTimestamp,
	buttonTitle,
}) => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const dispatch = useDispatch();

	let permissionCalendarStatus;

	// Request permissios to use system calendar (read and write)
	useEffect(() => {
		async function permissionsStatus() {
			permissionCalendarStatus = await calendar();
		}
		permissionsStatus();
	});

	const showDatePicker = () => {
		if (permissionCalendarStatus !== "granted") {
			Alert.alert("Access denied!", "No permission to use Your calendar.");
			return;
		}
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const alertButtons = [
		{
			text: "Ok",
			onPress: hideDatePicker,
		},
	];

	const handleConfirm = (date) => {
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
				`We are closed every ${upperCaseDay}`,
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
				`Every ${upperCaseDay}, You can pick Your reservation time between ${String(
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
			Alert.alert(
				"Good choice!",
				"Switch tabs and tell us more about Your reservation!",
				alertButtons
			);
			hideDatePicker();
			dispatch(pickDate(timestamp));
			return;
		}
		hideDatePicker();
	};

	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<Button title={buttonTitle} onPress={showDatePicker} />
			</View>
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="datetime"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
				hideDatePicker={hideDatePicker}
				date={new Date()}
				minimumDate={new Date(closestReservationTimestamp)}
				positiveButtonLabel="OK!"
				minuteInterval={5}
			/>
		</View>
	);
};

export default Calendar;

const styles = StyleSheet.create({
	container: {},
	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	closestDateInfo: {
		color: "#ffffff",
		marginBottom: 44,
	},
});

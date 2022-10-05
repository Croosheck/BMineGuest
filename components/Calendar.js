import React, { useEffect, useState } from "react";
import { Button, View } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useDispatch } from "react-redux";
import { pickDate } from "../redux/slices/user";
import { calendar } from "../util/permissions";

const Calendar = () => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const dispatch = useDispatch();

	// Request permissios to use system calendar (read and write)
	useEffect(() => {
		calendar();
	}, []);

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		const timestamp = new Date(date).valueOf();

		dispatch(pickDate(timestamp));

		hideDatePicker();
	};

	return (
		<View>
			<Button title="Show Date Picker" onPress={showDatePicker} />
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="datetime"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
				hideDatePicker={hideDatePicker}
			/>
		</View>
	);
};

export default Calendar;

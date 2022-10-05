import React, { useState } from "react";
import { Button, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useDispatch } from "react-redux";
import { pickDate } from "../redux/slices/user";

const Calendar = () => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const dispatch = useDispatch();

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

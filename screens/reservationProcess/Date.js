import { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

import Calendar from "../../components/Calendar";
import { formatDate } from "../../util/dateFormat";
import AddEvent from "../../components/AddEvent";
import { clearDate } from "../../redux/slices/user";

const Date = () => {
	const [displayTime, setDisplayTime] = useState();

	const { reservationDate } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!reservationDate) return;
		setDisplayTime(formatDate(reservationDate));
	}, [reservationDate]);

	function clearDateHandler() {
		dispatch(clearDate());
		setDisplayTime();
	}

	return (
		<View style={styles.container}>
			<Calendar />
			{reservationDate && <AddEvent eventDate={reservationDate} />}
			<Text style={styles.text}>{displayTime}</Text>
			<Button title="Clear date" onPress={clearDateHandler} />
		</View>
	);
};

export default Date;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
		padding: 8,
	},
	text: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
	},
});

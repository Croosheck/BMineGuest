import { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { clearDate } from "../../redux/slices/user";

import Calendar from "../../components/Calendar";
import AddEvent from "../../components/AddEvent";
import { formatDate } from "../../util/dateFormat";
import ClosestDateReservation from "../../components/ClosestDateReservation";

const Date = ({ route }) => {
	const [displayTime, setDisplayTime] = useState();

	const { reservationDate } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	const { restaurantKey, reservationAdvance, openDays } = route.params;

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
			<ClosestDateReservation reservationAdvance={reservationAdvance} />
			{displayTime && (
				<Text style={styles.label}>Your picked reservation:</Text>
			)}
			{displayTime && (
				<Text style={styles.pickedReservation}>{displayTime}</Text>
			)}
			<View style={styles.buttonsContainer}>
				<View style={styles.calendarButtonsContainer}>
					<View style={styles.calendarButton}>
						<Calendar
							reservationAdvance={reservationAdvance}
							openDays={openDays}
						/>
					</View>
					{reservationDate && (
						<View style={styles.calendarButton}>
							<Button title="Clear date" onPress={clearDateHandler} />
						</View>
					)}
				</View>
				{reservationDate && <AddEvent eventDate={reservationDate} />}
			</View>
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
	label: {
		color: "#ffffff",
	},
	pickedReservation: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
		marginBottom: Dimensions.get("window").height * 0.25,
	},
	buttonsContainer: {
		flex: 0.5,
		alignItems: "center",
		justifyContent: "center",
	},
	calendarButtonsContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: Dimensions.get("window").width * 0.9,
	},
	calendarButton: {
		width: "40%",
	},
});

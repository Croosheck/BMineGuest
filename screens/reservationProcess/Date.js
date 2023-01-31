import { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { clearDate } from "../../redux/slices/user";

import Calendar from "../../components/Calendar";
import AddEvent, { addEvent } from "../../components/AddEvent";
import { formatDate } from "../../util/formatDate";
import { closestDateReservation } from "../../util/closestDateReservation";
import { LinearGradient } from "expo-linear-gradient";

const Date = ({ route }) => {
	const [displayTime, setDisplayTime] = useState();

	const { reservationDate } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	const { restaurantKey, reservationAdvance, openDays, reservationsEnabled } =
		route.params;

	useEffect(() => {
		if (!reservationDate) return;
		setDisplayTime(formatDate(reservationDate));
	}, [reservationDate]);

	function clearDateHandler() {
		dispatch(clearDate());
		setDisplayTime();
	}

	const closestReservationTimestamp = closestDateReservation({
		reservationAdvance,
		reservationsEnabled,
		openDays,
	});

	// console.log(openDays);

	return (
		<LinearGradient style={styles.container} colors={["#000A2B", "#545351"]}>
			<Text
				style={styles.closestDateText}
			>{`Closest possible reservation date:\n${formatDate(
				closestReservationTimestamp
			)}`}</Text>
			<View style={styles.openDays}>
				{openDays.map((day, i) => {
					const dayToUpperCase =
						day.dayLong.slice(0, 1).toUpperCase() + day.dayLong.slice(1);
					const reservationsOpenHour = String(
						day.hours.reservationsOpen
					).padStart(2, 0);
					const reservationsCloseHour = String(
						day.hours.reservationsClose
					).padStart(2, 0);

					return (
						<View style={styles.openDayContainer} key={i}>
							<Text style={styles.openDay}>{dayToUpperCase}: </Text>
							<Text style={styles.openDay}>
								{reservationsOpenHour} - {reservationsCloseHour}
							</Text>
						</View>
					);
				})}
			</View>
			{displayTime && (
				<View style={styles.pickedReservation}>
					<Text style={styles.label}>Your picked reservation:</Text>
					<Text style={styles.pickedDate}>{displayTime}</Text>
				</View>
			)}
			<View style={styles.buttonsContainer}>
				<View style={styles.calendarButtonsContainer}>
					<View style={styles.calendarButton}>
						<Calendar
							reservationAdvance={reservationAdvance}
							openDays={openDays}
							closestReservationTimestamp={closestReservationTimestamp}
							buttonTitle={reservationDate ? "Change Date" : "Show Calendar"}
						/>
					</View>
					{reservationDate && (
						<View style={styles.calendarButton}>
							<Button title="Clear date" onPress={clearDateHandler} />
						</View>
					)}
				</View>
				{/* {reservationDate && (
					<Button
						title="Add to your calendar!"
						onPress={() => addEvent(reservationDate)}
					/>
				)} */}
			</View>
			<Text>Screen's not finished</Text>
		</LinearGradient>
	);
};

export default Date;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 8,
	},
	closestDateText: {
		marginBottom: "auto",
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
	},
	openDays: {
		width: "50%",
		padding: 10,
		borderWidth: 0.5,
		borderColor: "#ffffff",
	},
	openDayContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	openDay: {
		color: "#ffffff",
		fontSize: 18,
		textShadowColor: "#FFFFFF52",
		textShadowOffset: { height: -2, width: 2 },
		textShadowRadius: 2,
	},
	pickedReservation: {
		borderWidth: 0.5,
		borderColor: "#ffffff",
	},
	label: {
		color: "#ffffff",
	},
	pickedDate: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
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

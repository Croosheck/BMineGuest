import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { formatDate } from "../util/dateFormat";

const ClosestDateReservation = ({ reservationAdvance }) => {
	const closestTimestamp = new Date().valueOf() + reservationAdvance;
	const closestFormattedDate = formatDate(closestTimestamp);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				Closest possible reservation date: {closestFormattedDate}
			</Text>
		</View>
	);
};

export default ClosestDateReservation;

const styles = StyleSheet.create({
	container: {
		marginBottom: "auto",
	},
	text: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
	},
});

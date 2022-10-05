import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import Calendar from "../../components/Calendar";
import { formatDate } from "../../util/dateFormat";

const Reservation = () => {
	const [displayTime, setDisplayTime] = useState();

	const { reservationDate } = useSelector((state) => state.userReducer);

	useEffect(() => {
		if (!reservationDate) return;
		setDisplayTime(formatDate(reservationDate));
	}, [reservationDate]);

	return (
		<View style={styles.container}>
			<Calendar />
			<Text>{displayTime}</Text>
		</View>
	);
};

export default Reservation;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

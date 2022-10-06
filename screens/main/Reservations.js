import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Reservations = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Reservations</Text>
		</View>
	);
};

export default Reservations;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
	},
	text: {
		color: "#ffffff",
	},
});

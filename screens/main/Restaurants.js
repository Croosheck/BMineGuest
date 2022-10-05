import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Reservation from "../restaurants/Reservation";

const Restaurants = () => {
	return (
		<View style={styles.container}>
			<Reservation />
		</View>
	);
};

export default Restaurants;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

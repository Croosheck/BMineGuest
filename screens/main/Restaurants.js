import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Restaurants = () => {
	return (
		<View style={styles.container}>
			<Text>Restaurants</Text>
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

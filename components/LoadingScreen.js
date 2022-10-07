import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

const LoadingScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Loading...</Text>
		</View>
	);
};

export default LoadingScreen;

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

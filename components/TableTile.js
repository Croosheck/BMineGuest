import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const TableTile = ({ seats, shape, availability, onPress, picked }) => {
	return (
		<View style={styles.container}>
			<Pressable
				style={[styles.innerContainer, picked && styles.tablePicked]}
				onPress={onPress}
				android_ripple={{ color: "#CCCCCC52" }}
			>
				<Text style={styles.title}>Type: {shape}</Text>
				<Text style={styles.title}>Seats: {seats}</Text>
			</Pressable>
		</View>
	);
};

export default TableTile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: "hidden",
		borderRadius: 32,
		borderWidth: 2,
		borderColor: "#ffffff",
		margin: 6,
		height: Dimensions.get("window").width * 0.43,
		backgroundColor: "#3A1A1A",
	},
	tablePicked: {
		backgroundColor: "#CA6F6F",
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
	},
});

import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const OutlinedButton = ({ title, onPress, style, titleStyle }) => {
	return (
		<View style={[styles.container, style]}>
			<Pressable
				style={({ pressed }) => [
					styles.innerContainer,
					pressed && styles.pressed,
				]}
				android_ripple={{ color: "#FF73005F" }}
				onPress={onPress}
			>
				<Text style={[styles.title, titleStyle]}>{title}</Text>
			</Pressable>
		</View>
	);
};

export default OutlinedButton;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "#ffffff",
		borderRadius: 10,
		overflow: "hidden",
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	pressed: {
		opacity: 0.6,
	},
	title: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
});

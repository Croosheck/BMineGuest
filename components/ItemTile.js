import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "./Icon";

const ItemTile = ({
	title,
	textBelow,
	onPress,
	picked,
	availability,
	iconName,
	iconSize,
	iconColor,
}) => {
	return (
		<View style={styles.container}>
			<Pressable
				style={[styles.innerContainer, picked && styles.itemPicked]}
				onPress={onPress}
				android_ripple={{ color: "#CCCCCC89" }}
			>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>{title}</Text>
				</View>
				<View style={styles.textBelowContainer}>
					{iconName && (
						<Icon name={iconName} size={iconSize} color={iconColor} />
					)}
					<Text style={styles.textBelow}> {textBelow}</Text>
				</View>
			</Pressable>
		</View>
	);
};

export default ItemTile;

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
	itemPicked: {
		backgroundColor: "#CA6F6F",
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	titleContainer: {},
	title: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
	},
	textBelowContainer: {
		flexDirection: "row",
	},
	textBelow: {
		fontSize: 16,
		fontWeight: "400",
		color: "#ffffff",
	},
});

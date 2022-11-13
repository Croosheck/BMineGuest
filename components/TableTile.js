import {
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
	ImageBackground,
} from "react-native";
import React from "react";
import Icon from "./Icon";

const TableTile = ({
	title,
	textBelow,
	onPress,
	picked,
	availability,
	iconName,
	iconSize,
	iconColor,
	imgUri,
	tPlacement,
}) => {
	return (
		<View style={[styles.container, picked && styles.containerPicked]}>
			<Pressable
				style={[styles.innerContainer, picked && styles.itemPicked]}
				onPress={onPress}
				android_ripple={{ color: "#8C6D6D91" }}
			>
				<View style={[styles.labelContainer]}>
					<View style={styles.titleContainer}>
						<Text style={[styles.title, picked && { color: "#FFFFFF" }]}>
							{title}
						</Text>
					</View>
					<View style={styles.textBelowContainer}>
						{iconName && (
							<Icon name={iconName} size={iconSize} color={iconColor} />
						)}
						<Text style={[styles.textBelow, picked && { color: "#FFFFFF" }]}>
							{" "}
							{textBelow}
						</Text>
					</View>
					<Text style={[styles.textBelow, picked && { color: "#FFFFFF" }]}>
						{tPlacement}
					</Text>
				</View>
				<ImageBackground
					style={styles.imageBackgroundContainer}
					source={imgUri}
					imageStyle={[
						styles.imageBackground,
						picked && styles.imageBackgroundPicked,
					]}
					resizeMode="center"
				>
					<View></View>
				</ImageBackground>
			</Pressable>
		</View>
	);
};

export default TableTile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		borderRadius: 32,
		borderWidth: 2,
		borderColor: "#ffffff",
		margin: 8,
		marginVertical: 15,
		backgroundColor: "#3A1A1A",
		height: Dimensions.get("window").width * 0.43,
	},
	containerPicked: {
		elevation: 8,
		shadowColor: "#ffffff",
	},
	imageBackgroundContainer: {
		flex: 1,
		width: 350,
		height: 350,
		backgroundColor: "transparent",
		transform: [{ rotate: "35deg" }, { scale: 1 }, { translateX: 30 }],
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "#ffffff",
	},
	imageBackground: {
		width: "100%",
		height: "100%",
		// top: undefined,
		// left: undefined,
		// right: undefined,
		// bottom: undefined,
		opacity: 0.5,
		transform: [
			{ rotate: "-35deg" },
			{ scale: 1.5 },
			{ translateX: -17.5 },
			{ translateY: -10 },
		],
	},
	imageBackgroundPicked: {
		opacity: 1,
	},
	itemPicked: {
		flex: 1,
		width: "100%",
		backgroundColor: "#8080805A",
		borderWidth: 4,
		opacity: 1,
		borderColor: "#ffffff",
		borderRadius: 30,
	},
	innerContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		overflow: "hidden",
	},
	labelContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		paddingVertical: 5,
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

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

const ItemTile = ({
	title,
	textBelow,
	onPress,
	picked,
	availability,
	iconName,
	iconSize,
	iconColor,
	imgUri,
}) => {
	return (
		<ImageBackground
			style={styles.container}
			source={{ uri: imgUri }}
			imageStyle={[
				styles.imageBackground,
				picked && styles.imageBackgroundPicked,
			]}
		>
			<Pressable
				style={[styles.innerContainer, picked && styles.itemPicked]}
				onPress={onPress}
				android_ripple={{ color: "#8C6D6D91" }}
			>
				<View
					style={[
						styles.labelContainer,
						picked && { backgroundColor: "#00000096" },
					]}
				>
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
				</View>
			</Pressable>
		</ImageBackground>
	);
};

export default ItemTile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		borderRadius: 32,
		borderWidth: 2,
		borderColor: "#ffffff",
		margin: 6,
		backgroundColor: "#3A1A1A",
		height: Dimensions.get("window").width * 0.43,
	},
	imageBackground: {
		width: "100%",
		height: "100%",
		top: undefined,
		left: undefined,
		right: undefined,
		bottom: undefined,
		opacity: 0.3,
	},
	imageBackgroundPicked: {
		opacity: 1,
	},
	itemPicked: {
		flex: 1,
		width: "100%",
		backgroundColor: "#0B006F83",
		opacity: 1,
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	labelContainer: {
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

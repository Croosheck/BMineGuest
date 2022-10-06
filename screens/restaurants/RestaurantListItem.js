import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Pressable,
	ImageBackground,
} from "react-native";
import React from "react";

const RestaurantListItem = ({
	name,
	imageUri,
	description,
	reservationsStatus,
	onPress,
}) => {
	return (
		<View style={styles.outerContainer}>
			<ImageBackground
				style={styles.container}
				source={imageUri}
				// resizeMode="center"
			>
				<Pressable
					style={styles.pressableContainer}
					android_ripple={{ color: "#B1B1B135" }}
					onPress={onPress}
				>
					<View style={styles.nameContainer}>
						<Text style={styles.name}>{name}</Text>
					</View>
				</Pressable>
			</ImageBackground>
		</View>
	);
};

export default RestaurantListItem;

const styles = StyleSheet.create({
	outerContainer: {
		padding: 4,
		borderRadius: 24,
		marginHorizontal: Dimensions.get("window").width * 0.03,
		marginVertical: Dimensions.get("window").height * 0.015,
		backgroundColor: "#B6B6B6",
		borderWidth: 2,
		borderColor: "#5B5B5B9B",
		// elevation: 8,
		// shadowColor: "black",
		// shadowOpacity: 0.35,
		// shadowOffset: { width: 0, height: 2 },
		// shadowRadius: 24,
	},
	container: {
		flex: 1,
		width: "100%",
		height: "100%",
		borderRadius: 20,
		overflow: "hidden",
	},
	pressableContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: Dimensions.get("window").width * 0.65,
		borderRadius: 20,
	},
	nameContainer: {
		backgroundColor: "#CCCCCC8A",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000000",
	},
});

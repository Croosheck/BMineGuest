import {
	Button,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React from "react";

const RestaurantProfile = ({ route }) => {
	const { name, imageUri, description } = route.params;
	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Text style={styles.title}>{name}</Text>
				<Image source={imageUri} style={styles.image} />
			</View>
			<View style={styles.menuContainer}>
				<View style={styles.detailsContainer}>
					<Text style={styles.description}>{description}</Text>
				</View>
				<View style={styles.buttonsContainer}>
					<View style={styles.button}>
						<Button title="Button" />
					</View>
					<View style={styles.button}>
						<Button title="Button" />
					</View>
				</View>
			</View>
		</View>
	);
};

export default RestaurantProfile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
		padding: 8,
	},
	imageContainer: {
		flex: 0.5,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	image: {
		height: Dimensions.get("window").width * 0.6,
		width: Dimensions.get("window").width * 0.95,
		borderWidth: 2,
		borderColor: "#ffffff",
		borderRadius: 20,
	},
	title: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: 16,
	},
	menuContainer: {
		flex: 0.6,
		justifyContent: "space-between",
		width: Dimensions.get("window").width,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	detailsContainer: {
		flexDirection: "column",
		justifyContent: "flex-start",
	},
	description: {
		textAlign: "center",
		color: "#ffffff",
		marginVertical: 24,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	button: {
		width: Dimensions.get("window").width * 0.4,
		marginHorizontal: 24,
	},
});

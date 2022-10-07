import { useEffect } from "react";
import {
	Button,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slices/user";

const RestaurantProfile = ({ navigation, route }) => {
	const { name, imageUri, description } = route.params;

	const dispatch = useDispatch();
	const { name: username, email } = useSelector(
		(state) => state.userReducer.currentUser
	);

	useEffect(() => {
		dispatch(getUser());
	}, []);

	function onReserveHandler() {
		navigation.navigate("ReserveMain");
	}

	const emailShown = email ? (
		<Text style={styles.description}>{email}</Text>
	) : (
		<Text style={[styles.description, { opacity: 0 }]}>.</Text>
	);

	const usernameShown = username ? (
		<Text style={styles.description}>{username}</Text>
	) : (
		<Text style={[styles.description, { opacity: 0 }]}>.</Text>
	);

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Text style={styles.title}>{name}</Text>
				<Image source={imageUri} style={styles.image} />
			</View>
			<View style={styles.menuContainer}>
				<View style={styles.detailsContainer}>
					<Text style={styles.description}>{description}</Text>
					<Text style={styles.description}>{description}</Text>
					{emailShown}
					{usernameShown}
				</View>
				<View style={styles.buttonsContainer}>
					{/* <View style={styles.button}>
						<Button title="Social" />
					</View> */}
					<View style={styles.button}>
						<Button title="Reserve" onPress={onReserveHandler} />
					</View>
					{/* <View style={styles.button}>
						<Button title="Navigate" />
					</View> */}
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
		flex: 0.55,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	image: {
		height: Dimensions.get("window").height * 0.35,
		width: Dimensions.get("window").width * 0.95,
		borderWidth: 2,
		borderColor: "#ffffff",
		borderRadius: 20,
	},
	title: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
	},
	menuContainer: {
		flex: 0.6,
		justifyContent: "space-between",
		width: Dimensions.get("window").width,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	detailsContainer: {
		flex: 0.9,
		justifyContent: "center",
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	description: {
		textAlign: "center",
		color: "#ffffff",
		marginVertical: Dimensions.get("window").height * 0.01,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: Dimensions.get("window").height * 0.02,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	button: {
		minWidth: Dimensions.get("window").width * 0.25,
		marginHorizontal: 12,
	},
});

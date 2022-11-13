import { useEffect, useState } from "react";
import {
	Button,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useDispatch } from "react-redux";
import { getUser } from "../../redux/slices/user";
import { getRestaurantProfileImage } from "../../util/storage";

const RestaurantProfile = ({ navigation, route }) => {
	const [profileImgUri, setProfileImgUri] = useState();
	const [howMany, setHowMany] = useState(1);

	const {
		name,
		description,
		restaurantKey,
		restaurantUid,
		reservationAdvance,
		openDays,
		reservationLimit,
	} = route.params;

	const dispatch = useDispatch();

	function howManyHandler(type) {
		if (type === "increment") {
			setHowMany((prev) => {
				if (prev >= reservationLimit) return reservationLimit;
				return prev + 1;
			});
		}
		if (type === "decrement") {
			setHowMany((prev) => {
				if (prev <= 1) return 1;
				return prev - 1;
			});
		}
	}

	useEffect(() => {
		async function getRestaurantDataHandler() {
			const profileImage = await getRestaurantProfileImage(restaurantUid);
			setProfileImgUri(profileImage);
		}
		getRestaurantDataHandler();

		dispatch(getUser());
	}, []);

	function onReserveHandler() {
		navigation.navigate("ReserveMain", {
			restaurantKey: restaurantKey,
			name: name,
			restaurantUid: restaurantUid,
			reservationAdvance: reservationAdvance,
			openDays: openDays,
			howMany: howMany,
		});
	}

	//// Fetching upcoming reservations in this particular restaurant (will be implemented in the near future)
	// async function getReservationsHandler() {
	// 	const reservationsData = await getReservations();
	// }

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{name}</Text>
			<View style={styles.imageContainer}>
				<Image source={{ uri: profileImgUri }} style={styles.image} />
			</View>
			<View style={styles.menuContainer}>
				<View style={styles.detailsContainer}>
					<Text style={styles.description}>{description}</Text>
				</View>
				<View style={styles.buttonsContainer}>
					<View style={styles.setButton}>
						<Button
							title="-"
							onPress={howManyHandler.bind(this, "decrement")}
						/>
					</View>
					<View style={styles.button}>
						<Button
							title={`Booking for ${howMany}`}
							onPress={onReserveHandler}
						/>
					</View>
					<View style={styles.setButton}>
						<Button
							title="+"
							onPress={howManyHandler.bind(this, "increment")}
						/>
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
		padding: 4,
	},
	/////////////////
	imageContainer: {
		// flex: 1,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	title: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
	},
	image: {
		height: Dimensions.get("window").height * 0.35,
		width: Dimensions.get("window").width * 0.95,
		borderWidth: 2,
		borderColor: "#ffffff",
		borderRadius: 20,
	},
	////////////////
	menuContainer: {
		flex: 1,
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
		alignItems: "center",
		marginBottom: Dimensions.get("window").height * 0.02,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	button: {
		minWidth: Dimensions.get("window").width * 0.34,
		height: Dimensions.get("window").width * 0.1,
		marginHorizontal: 12,
	},
	setButton: {
		width: Dimensions.get("window").width * 0.1,
		height: Dimensions.get("window").width * 0.1,
	},
});

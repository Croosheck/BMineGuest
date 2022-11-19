import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useDispatch } from "react-redux";
import { closestDateReservation } from "../../util/closestDateReservation";
import OutlinedButton from "../../components/OutlinedButton";
import { getUser } from "../../redux/slices/user";
import { formatDate } from "../../util/dateFormat";
import { getRestaurantProfileImage } from "../../util/storage";

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;

const TEST_IMAGES = [
	{ src: require("../../assets/test/118427365.jpg") },
	{ src: require("../../assets/test/1082098712.jpg") },
	{ src: require("../../assets/test/1152363266.jpg") },
	{ src: require("../../assets/test/1236348563.jpg") },
	{ src: require("../../assets/test/3030495495.jpg") },
	{ src: require("../../assets/test/5236388674.jpg") },
	{ src: require("../../assets/test/6347299673.jpg") },
	{ src: require("../../assets/test/8124363672.jpg") },
	{ src: require("../../assets/test/9991969801.jpg") },
];
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
		reservationsEnabled,
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
			reservationsEnabled: reservationsEnabled,
		});
	}

	//// Fetching upcoming reservations in this particular restaurant (will be implemented in the near future)
	// async function getReservationsHandler() {
	// 	const reservationsData = await getReservations();
	// }

	const closestReservationTimestamp = closestDateReservation({
		reservationAdvance,
		reservationsEnabled,
		openDays,
	});

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: profileImgUri }} style={styles.image} />
			</View>
			<View style={styles.menuContainer}>
				<View style={styles.titleOuterContainer}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{name}</Text>
					</View>
					<LinearGradient
						style={styles.closestDateContainer}
						colors={["#C29100", "#B10606"]}
						start={{ x: 0.3, y: 0.3 }}
						end={{ x: 0.9, y: 0.9 }}
					>
						<Text style={styles.closestDate}>{`Closest\nAv. Date:\n${formatDate(
							closestReservationTimestamp,
							"onlyDate"
						)}`}</Text>
					</LinearGradient>
				</View>
				<View style={styles.tagsContainer}>
					<Text style={styles.tag}>Dogs</Text>
					<Text style={styles.tag}>Smoke Area</Text>
					<Text style={styles.tag}>Silent Area</Text>
				</View>
				<View style={styles.descriptionContainer}>
					<View style={styles.descriptionInnerContainer}>
						<Text style={styles.description}>{description}</Text>
					</View>
				</View>
				<View style={styles.restaurantImagesContainer}>
					<ScrollView
						style={styles.restaurantImagesScrollViewContainer}
						contentContainerStyle={styles.restaurantImagesScrollViewContent}
						horizontal
					>
						{TEST_IMAGES.map((img, i) => {
							return (
								<Image
									key={i}
									source={img.src}
									style={styles.restaurantGalleryImage}
								/>
							);
						})}
					</ScrollView>
				</View>
				{reservationsEnabled && (
					<View style={styles.buttonsContainer}>
						<View style={styles.setButton}>
							<OutlinedButton
								title="-"
								onPress={howManyHandler.bind(this, "decrement")}
								style={{ borderWidth: 1 }}
								titleStyle={{ fontSize: 25, fontWeight: "default" }}
							/>
						</View>
						<View style={styles.button}>
							<OutlinedButton
								title={`Reservation for ${howMany}`}
								onPress={onReserveHandler}
							/>
						</View>
						<View style={styles.setButton}>
							<OutlinedButton
								title="+"
								onPress={howManyHandler.bind(this, "increment")}
								style={{ borderWidth: 1 }}
								titleStyle={{ fontSize: 25, fontWeight: "default" }}
							/>
						</View>
					</View>
				)}
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
	},
	/////////////////
	imageContainer: {
		// flex: 1,
		borderBottomWidth: 2,
		borderColor: "#ffffff",
	},
	image: {
		height: Dimensions.get("window").height * 0.35,
		width: Dimensions.get("window").width,
		// borderWidth: 2,
		// borderColor: "#ffffff",
		// borderRadius: 20,
	},
	////////////////
	menuContainer: {
		flex: 1,
		width: Dimensions.get("window").width,
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	titleOuterContainer: {
		flexDirection: "row",

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	titleContainer: {
		width: "100%",
		height: 50,
		alignItems: "flex-start",
		justifyContent: "center",

		backgroundColor: "#6238384B",
	},
	title: {
		color: "#ffffff",
		fontSize: 22,
		fontWeight: "bold",
		marginLeft: MARGIN_LEFT,
	},
	closestDateContainer: {
		width: 110,
		height: 110,
		borderRadius: 55,
		position: "absolute",
		right: 0,
		bottom: 0,
		marginRight: 10,
		// backgroundColor: "#C29100",
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	closestDate: {
		textAlign: "center",
		color: "#ffffff",
		position: "absolute",
		bottom: "35%",
		left: 0,
		right: 0,
		fontWeight: "bold",
		fontSize: 15,
	},
	dateStyle: {
		color: "#000000",
		marginTop: 10,
		paddingTop: 10,
		fontSize: 16,
		fontWeight: "900",
	},
	tagsContainer: {
		width: "100%",
		flexDirection: "row",
		marginLeft: MARGIN_LEFT,
		marginTop: 10,
	},
	tag: {
		marginRight: 15,
		backgroundColor: "#C29200CA",
		paddingHorizontal: 12,
		paddingVertical: 2,
		borderRadius: 20,
		fontWeight: "bold",
		color: "#ffffff",
	},
	descriptionContainer: {
		flex: 0.3,
		justifyContent: "center",
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		marginTop: 10,
		marginBottom: 20,
		paddingBottom: 20,
		borderBottomWidth: 0.5,
		borderColor: "#cccccc",

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	descriptionInnerContainer: {
		// backgroundColor: "#cccccc",
		// borderWidth: 2,
		// borderColor: "#FFFFFF",
	},
	description: {
		color: "#ffffff",
		fontStyle: "italic",
		fontSize: 15,
		letterSpacing: 0.4,
	},
	restaurantImagesContainer: {
		flex: 0.4,
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: MARGIN_LEFT,
		marginTop: 10,

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	restaurantImagesScrollViewContainer: {
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	restaurantImagesScrollViewContent: {
		// alignItems: "center",
	},
	restaurantGalleryImage: {
		width: Dimensions.get("window").width * 0.5,
		height: "100%",
		marginRight: 15,
		borderRadius: 12,

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	buttonsContainer: {
		flex: 0.15,
		flexDirection: "row",
		justifyContent: "center",
		marginTop: "auto",
		marginBottom: 5,

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	button: {
		minWidth: Dimensions.get("window").width * 0.4,
		height: Dimensions.get("window").width * 0.1,
		marginHorizontal: 12,
	},
	setButton: {
		width: Dimensions.get("window").width * 0.1,
		height: Dimensions.get("window").width * 0.1,
	},
});

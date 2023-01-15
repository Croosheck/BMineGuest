import { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useDispatch } from "react-redux";
import { closestDateReservation } from "../../util/closestDateReservation";
import OutlinedButton from "../../components/OutlinedButton";
import { getUser } from "../../redux/slices/user";
import { formatDate } from "../../util/formatDate";
import { getRestaurantProfileImage } from "../../util/storage";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { auth, storage } from "../../firebase";

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;

// const TEST_IMAGES = [
// 	{ src: require("../../assets/test/118427365.jpg") },
// 	{ src: require("../../assets/test/1082098712.jpg") },
// 	{ src: require("../../assets/test/1152363266.jpg") },
// 	{ src: require("../../assets/test/1236348563.jpg") },
// 	{ src: require("../../assets/test/3030495495.jpg") },
// 	{ src: require("../../assets/test/5236388674.jpg") },
// 	{ src: require("../../assets/test/6347299673.jpg") },
// 	{ src: require("../../assets/test/8124363672.jpg") },
// 	{ src: require("../../assets/test/9991969801.jpg") },
// ];
const RestaurantProfile = ({ navigation, route }) => {
	const [profileImgUri, setProfileImgUri] = useState();
	const [howMany, setHowMany] = useState(1);
	const [profileGallery, setProfileGallery] = useState([]);

	const {
		name,
		description,
		restaurantKey,
		restaurantUid,
		reservationAdvance,
		openDays,
		reservationLimit,
		reservationsEnabled,
		restaurantTags,
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

		async function getGalleryImages() {
			const listRef = ref(
				storage,
				`restaurants/${restaurantUid}/profileGallery`
			);
			const response = await listAll(listRef);

			if (profileGallery.length >= response.items.length) return;

			response.items.forEach(async (item) => {
				const galleryImgRef = ref(
					storage,
					`restaurants/${restaurantUid}/profileGallery/${item.name}`
				);

				const galleryImgUri = await getDownloadURL(galleryImgRef);

				setProfileGallery((gallery) => [...gallery, galleryImgUri]);
			});
		}

		getRestaurantDataHandler();
		getGalleryImages();

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

	const isAnyOpen = openDays.some((day) => day.isOpen);

	const dateContent =
		closestReservationTimestamp && reservationsEnabled && isAnyOpen ? (
			<View style={styles.closestDateInnerContainer}>
				<Text style={styles.closestDate}>{`Nearest\navail. date:`}</Text>
				<Text style={[styles.closestDate, styles.dateStyle]}>
					{formatDate(closestReservationTimestamp, "onlyDate")}
				</Text>
			</View>
		) : (
			<View style={styles.closestDateInnerContainer}>
				<Text
					style={[
						styles.closestDate,
						styles.dateStyle,
						{
							top: "9%",
							fontSize: 16.5,
							textShadowRadius: 2,
						},
					]}
				>
					Reservations currently disabled.
				</Text>
			</View>
		);

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
					<ImageBackground
						style={styles.closestDateContainer}
						imageStyle={styles.closestDatePlateImage}
						// colors={["#C29100", "#B10606"]}
						// start={{ x: 0.3, y: 0.3 }}
						// end={{ x: 0.9, y: 0.9 }}
						source={require("../../assets/restaurantProfile/plate1.png")}
					>
						{dateContent}
					</ImageBackground>
				</View>
				<View style={styles.tagsContainer}>
					<ScrollView contentContainerStyle={styles.tagsContent} horizontal>
						{restaurantTags.map((tag, i) => (
							<Text style={styles.tag} key={i}>
								{tag.tagName}
							</Text>
						))}
					</ScrollView>
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
						{profileGallery.map((imgUri, i) => {
							return (
								<Image
									key={i}
									style={styles.restaurantGalleryImage}
									source={{ uri: imgUri }}
								/>
							);
						})}
					</ScrollView>
				</View>
				{reservationsEnabled && isAnyOpen && (
					<View style={styles.buttonsContainer}>
						<View style={styles.setButton}>
							<OutlinedButton
								title="-"
								onPress={howManyHandler.bind(this, "decrement")}
								style={{ borderWidth: 1 }}
								titleStyle={{
									fontSize: 28,
									fontWeight: "default",
									textShadowColor: "white",
									textShadowRadius: 6,
								}}
							/>
						</View>
						<View style={styles.button}>
							<OutlinedButton
								title={`Reservation for ${howMany}`}
								onPress={onReserveHandler}
								titleStyle={{ textShadowColor: "white", textShadowRadius: 6 }}
							/>
						</View>
						<View style={styles.setButton}>
							<OutlinedButton
								title="+"
								onPress={howManyHandler.bind(this, "increment")}
								style={{ borderWidth: 1 }}
								titleStyle={{
									fontSize: 28,
									fontWeight: "default",
									textShadowColor: "white",
									textShadowRadius: 6,
								}}
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
		fontWeight: "900",
		letterSpacing: 0.7,
		marginLeft: MARGIN_LEFT,

		textShadowColor: "white",
		textShadowRadius: 3,
	},
	closestDateContainer: {
		width: 130,
		height: 130,
		position: "absolute",
		right: 0,
		bottom: 0,
		marginRight: 10,

		// borderWidth: 2,
		// borderColor: "#FFFFFF",
		// borderRadius: 65,
	},
	closestDatePlateImage: {
		// borderWidth: 2,
		borderColor: "#FFFFFF",
		borderRadius: 65,
	},
	closestDateInnerContainer: {
		position: "absolute",
		bottom: "30%",
		left: 0,
		right: 0,
	},
	closestDate: {
		textAlign: "center",
		color: "#ffffff",
		fontWeight: "500",
		fontSize: 15,
		textShadowColor: "white",
		textShadowRadius: 6,
	},
	dateStyle: {
		fontWeight: "900",
		// color: "#57851A",
		color: "#00FFAE",
		marginTop: 5,
		top: "-5%",
		fontSize: 18,
	},
	tagsContainer: {
		width: "100%",
	},
	tagsContent: {
		marginVertical: 10,
		marginLeft: MARGIN_LEFT,
		paddingRight: 20,
	},
	tag: {
		height: 25,
		marginRight: 10,
		backgroundColor: "#2C60C7",
		paddingHorizontal: 12,
		paddingVertical: 1,
		paddingBottom: 2,
		borderRadius: 20,
		fontWeight: "600",
		color: "#ffffff",

		textShadowColor: "white",
		textShadowRadius: 4,
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

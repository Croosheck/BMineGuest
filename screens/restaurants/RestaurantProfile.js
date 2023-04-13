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
import { storage } from "../../firebase";
import { LinearGradient } from "expo-linear-gradient";

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const TITLE_CONTAINER_HEIGHT = 50;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

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
		phone,
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
			phone: phone,
		});
	}

	const restaurantTitleDynamicFontSize = name.length < 22 ? 24 : 20;

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
					numberOfLines={3}
					style={[
						styles.closestDate,
						styles.dateStyle,
						{
							top: "9%",
							fontSize: WIDTH * 0.04,
							textShadowRadius: 3,
						},
					]}
				>
					Reservations currently disabled.
				</Text>
			</View>
		);

	return (
		<LinearGradient
			style={styles.container}
			colors={["#2E273D", "#FFFFFF5D"]}
			start={{ x: 0, y: 0.7 }}
			end={{ x: 1, y: 0 }}
		>
			<View style={styles.imageContainer}>
				<Image source={{ uri: profileImgUri }} style={styles.image} />
			</View>

			<View style={styles.detailsContainer}>
				<View style={styles.titleOuterContainer}>
					<View style={styles.titleContainer}>
						<Text
							style={[
								styles.title,
								{ fontSize: restaurantTitleDynamicFontSize },
							]}
						>
							{name}
						</Text>
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
					<ScrollView style={styles.descriptionInnerContainer}>
						<Text style={styles.description}>{description}</Text>
					</ScrollView>
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
								titleStyle={styles.setButtonTitle}
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
								titleStyle={styles.setButtonTitle}
							/>
						</View>
					</View>
				)}
			</View>
		</LinearGradient>
	);
};

export default RestaurantProfile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#A13C61",
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
	detailsContainer: {
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
		height: TITLE_CONTAINER_HEIGHT,
		alignItems: "flex-start",
		justifyContent: "center",

		backgroundColor: "#12243D1E",
	},
	title: {
		color: "#ffffff",
		fontWeight: "900",
		letterSpacing: 0.7,
		marginLeft: MARGIN_LEFT,
		width: "100%",

		textShadowColor: "#000000B1",
		textShadowRadius: 5,
		textShadowOffset: { width: 3, height: 2 },
	},
	closestDateContainer: {
		width: WIDTH * 0.33,
		height: WIDTH * 0.33,
		position: "absolute",
		right: 0,
		bottom: TITLE_CONTAINER_HEIGHT * 0.7,
		marginRight: WIDTH * 0.01,

		// borderWidth: 2,
		borderColor: "#FFFFFF",
		borderRadius: WIDTH * 0.33 * 0.5,
	},
	closestDatePlateImage: {
		// borderWidth: 2,
		borderColor: "#FFFFFF",
		borderRadius: WIDTH * 0.35 * 0.5,
	},
	closestDateInnerContainer: {
		position: "absolute",
		top: "20%",
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
		color: "#00FFAE",
		// color: "#57851A",
		marginTop: 5,
		top: -5,
		fontSize: 17,
	},
	tagsContainer: {
		width: "100%",
	},
	tagsContent: {
		marginVertical: 15,
		marginLeft: MARGIN_LEFT,
		paddingRight: 20,
	},
	tag: {
		marginRight: 7,
		// backgroundColor: "#171F30",
		backgroundColor: "#4F8BA4",
		paddingHorizontal: 12,
		paddingVertical: 1,
		paddingBottom: 2,
		borderRadius: 20,
		fontWeight: "600",
		color: "#ffffff",

		textShadowColor: "#000000AF",
		textShadowRadius: 3,
	},
	descriptionContainer: {
		flex: 0.3,
		justifyContent: "center",
		marginLeft: MARGIN_LEFT,
		marginRight: MARGIN_RIGHT,
		marginBottom: 15,
		paddingBottom: 15,
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

		textShadowColor: "#FFFFFFCD",
		textShadowRadius: 3,
	},
	restaurantImagesContainer: {
		flex: 0.45,
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: MARGIN_LEFT,

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	restaurantImagesScrollViewContainer: {
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	restaurantImagesScrollViewContent: {
		// alignItems: "center",
		borderRadius: 12,
		overflow: "hidden",
	},
	restaurantGalleryImage: {
		width: WIDTH * 0.6,
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
	setButtonTitle: {
		fontSize: 28,
		fontWeight: "normal",
		textShadowColor: "white",
		textShadowRadius: 6,
	},
});

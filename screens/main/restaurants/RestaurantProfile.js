import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

import { useDispatch } from "react-redux";
import { getUser } from "../../../redux/slices/user";
import {
	getRestaurantGalleryImages,
	getRestaurantProfileImage,
} from "../../../util/storage";
import { LinearGradient } from "expo-linear-gradient";
import NearestDate from "./restaurantProfile/NearestDate";
import TitleBar from "./restaurantProfile/TitleBar";
import Tags from "./restaurantProfile/Tags";
import Description from "./restaurantProfile/Description";
import Gallery from "./restaurantProfile/Gallery";
import Buttons from "./restaurantProfile/Buttons";
import AddFavorite from "./restaurantProfile/AddFavorite";
import {
	getFavorite,
	removeFavorite,
	setAsFavorite,
} from "./utils/favoriteHandler";
import BackButton from "./restaurantProfile/BackButton";

const MARGIN_LEFT = 20;
const DESCRIPTION_MARGIN_RIGHT = 20;
const TITLE_CONTAINER_HEIGHT = 50;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const RestaurantProfile = ({ navigation, route }) => {
	const [profileImgUri, setProfileImgUri] = useState();
	const [howMany, setHowMany] = useState(1);
	const [profileGallery, setProfileGallery] = useState([]);
	const [isRestaurantFavorite, setIsRestaurantFavorite] = useState({
		isFav: false,
		isLoaded: false,
	});

	const dispatch = useDispatch();

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
		url,
		tables,
		tablesFiltering,
	} = route.params;

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

	async function onFavPressHandler() {
		if (isRestaurantFavorite.isFav) {
			removeFavorite(restaurantUid);
			setIsRestaurantFavorite((prev) => ({
				...prev,
				isFav: false,
			}));
			return;
		}

		setAsFavorite({
			restaurantUid: restaurantUid,
			restaurantName: name,
		});

		setIsRestaurantFavorite((prev) => ({
			...prev,
			isFav: true,
		}));
	}

	useEffect(() => {
		async function getRestaurantDataHandler() {
			const profileImage = await getRestaurantProfileImage(restaurantUid);
			setProfileImgUri(profileImage);

			const wasFavedBefore = await getFavorite({
				restaurantUid: restaurantUid,
			});

			setIsRestaurantFavorite({
				isLoaded: true,
				isFav: wasFavedBefore,
			});
		}

		getRestaurantGalleryImages({
			profileGallery: profileGallery,
			setCallback: setProfileGallery,
			restaurantUid: restaurantUid,
		});

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
			phone: phone,
			url: url,
			tables: tables,
			tablesFiltering: tablesFiltering,
		});
	}

	//// Fetching upcoming reservations in this particular restaurant (will be implemented in the near future)
	// async function getReservationsHandler() {
	// 	const reservationsData = await getReservations();
	// }

	const isAnyOpen = openDays.some((day) => day.isOpen);

	return (
		<LinearGradient
			style={styles.container}
			colors={["#2E273D", "#FFFFFF5D"]}
			start={{ x: 0, y: 0.7 }}
			end={{ x: 1, y: 0 }}
		>
			<View style={styles.imageContainer}>
				<Image source={{ uri: profileImgUri }} style={styles.image} />

				{isRestaurantFavorite.isLoaded && (
					<AddFavorite
						onFavPress={onFavPressHandler}
						isFavorite={isRestaurantFavorite.isFav}
					/>
				)}

				<BackButton onPress={() => navigation.goBack()} />
			</View>

			<View style={styles.detailsContainer}>
				<NearestDate
					reservationAdvance={reservationAdvance}
					reservationsEnabled={reservationsEnabled}
					openDays={openDays}
				/>

				<TitleBar
					name={name}
					marginLeft={MARGIN_LEFT}
					height={TITLE_CONTAINER_HEIGHT}
				/>

				<Tags restaurantTags={restaurantTags} marginLeft={MARGIN_LEFT} />

				<Description
					description={description}
					marginLeft={MARGIN_LEFT}
					marginRight={DESCRIPTION_MARGIN_RIGHT}
				/>

				<Gallery
					profileGallery={profileGallery}
					marginLeft={MARGIN_LEFT}
					width={WIDTH * 0.6}
				/>

				<Buttons
					screenWidth={WIDTH}
					howManyHandler={howManyHandler}
					howMany={howMany}
					onReserveHandler={onReserveHandler}
					visible={reservationsEnabled && isAnyOpen}
					sideButtonsSize={26}
				/>
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
	imageContainer: {
		borderBottomWidth: 2,
		borderColor: "#ffffff",
	},
	image: {
		height: HEIGHT * 0.35,
		width: WIDTH,
	},
	detailsContainer: {
		flex: 1,
		width: WIDTH,
	},
});

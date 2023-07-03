import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Easing,
	StyleSheet,
	View,
} from "react-native";
import { useEffect, useLayoutEffect, useRef, useState, memo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser } from "../../redux/slices/user";

import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import LottieIcon from "../../components/LottieIcon";
import LogoutButton from "./profile/LogoutButton";
import ProfileImage from "./profile/ProfileImage";
import UserName from "./profile/UserName";
import Stats from "./profile/stats/Stats";
import BackgroundImageWrapper from "./profile/BackgroundImageWrapper";
import Favs from "./profile/favs/Favs";
import { getFavs, getRestaurantData } from "./profile/utils/getFavs";
import AllFavsModal from "./profile/AllFavsModal";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#1F1616";

const Profile = ({ navigation }) => {
	const userProfileRef = doc(db, "users", auth.currentUser?.uid);
	const userReservationRef = collection(
		db,
		"users",
		auth.currentUser?.uid,
		"reservations"
	);

	let logoutInProgress = false;

	const [profileImage, setProfileImage] = useState();
	const [reservationsCounter, setReservationsCounter] = useState({
		active: 0,
		upcoming: 0,
		total: 0,
	});
	const [favRestaurants, setFavRestaurants] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isMoreFavsToDisplay, setIsMoreFavsToDisplay] = useState(false);
	const [allFavsModal, setAllFavsModal] = useState({
		isOpen: false,
		data: [],
		isLoading: false,
	});
	const { currentUser } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	const animationProgress = useRef(new Animated.Value(0));

	useLayoutEffect(() => {
		// Icon animation on click
		const unsubscribeFocus = navigation.addListener("focus", () => {
			navigation.setOptions({
				tabBarIcon: ({ color }) => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieProfile.json")}
							progress={animationProgress.current}
							width={50}
							transform={[{ translateY: -4 }]}
							colorFilters={[
								{
									//circle
									keypath: "User Outlines 2",
									color: "#9288FF",
								},
								{
									//fork
									keypath: "User Outlines",
									color: "#595959",
								},
								// {
								// 	//knife
								// 	keypath: "Layer 10",
								// 	color: "#FF9696",
								// },
							]}
						/>
					);
				},
			});

			getFavRestaurants();

			Animated.timing(animationProgress.current, {
				toValue: 1,
				duration: 700,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		});

		// Icon animation on screen change (back to default)
		const unsubscribeBlur = navigation.addListener("blur", () => {
			navigation.setOptions({
				tabBarIcon: () => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieProfile.json")}
							progress={animationProgress.current}
							width={50}
							transform={[{ translateY: -4 }]}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 0,
				duration: 500,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();

			// setIsMoreFavsToDisplay(false);
		});

		return () => {
			// Event listeners clearing
			unsubscribeFocus();
			unsubscribeBlur();
		};
	}, []);

	async function logoutHandler() {
		if (logoutInProgress) return;

		logoutInProgress = true;

		try {
			signOut(auth);
			dispatch(logoutUser());
		} catch (error) {
			console.log(error);
		} finally {
			logoutInProgress = false;
		}
	}

	async function getUserData() {
		let imageItemName;

		const imageFolderRef = ref(
			storage,
			`users/${auth.currentUser?.uid}/profilePic`
		);

		const list = await listAll(imageFolderRef);
		list.items.forEach((item) => (imageItemName = item.name));

		let upcomingReservations = 0;
		dispatch(getUser());
		const profileImageRef = ref(
			storage,
			`users/${auth.currentUser?.uid}/profilePic/${imageItemName}`
		);

		const profileImgUri = await getDownloadURL(profileImageRef);

		setProfileImage(profileImgUri);

		const querySnapshot = await getDocs(userReservationRef);

		const currentTimestamp = new Date().valueOf();

		querySnapshot.forEach((doc) => {
			if (doc.data().reservationDateTimestamp > currentTimestamp)
				++upcomingReservations;
		});

		const unsub = onSnapshot(userProfileRef, (doc) => {
			setReservationsCounter({
				upcoming: upcomingReservations,
				total: doc.data().totalReservations,
			});
		});
	}

	async function getFavRestaurants(listLimit = 2) {
		setIsLoading(true);

		try {
			const { isMoreThanLimit, favsData } = await getFavs({
				listLimit: listLimit,
			});
			setFavRestaurants(favsData);
			setIsMoreFavsToDisplay(isMoreThanLimit);
		} catch (error) {
			console.log("Something went wrong while fetching favs: ", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function showAllFavsHandler() {
		setAllFavsModal({
			isOpen: true,
			data: [],
			isLoading: true,
		});

		try {
			const { favsData } = await getFavs({
				// "0" means no limit
				listLimit: 0,
			});
			setAllFavsModal((prev) => ({
				...prev,
				data: favsData,
			}));
		} catch (error) {
			console.log(error);
		} finally {
			setAllFavsModal((prev) => ({
				...prev,
				isLoading: false,
			}));
		}
	}

	async function onFavPressHandler(data = {}, type = "") {
		const restaurantData = await getRestaurantData(data.id);

		if (type === "modal") {
			setAllFavsModal({
				isOpen: false,
				data: [],
				isLoading: false,
			});
		}

		navigation.navigate("RestaurantProfile", {
			name: restaurantData.name,
			description: restaurantData.description
				? restaurantData.description
				: "No description.",
			imageUri: restaurantData.imageUri,
			restaurantKey: restaurantData.key,
			restaurantUid: restaurantData.uid,
			reservationAdvance: restaurantData.reservationAdvance,
			openDays: restaurantData.openDays,
			reservationLimit: restaurantData.reservationLimit,
			reservationsEnabled: restaurantData.reservationsEnabled,
			restaurantTags: restaurantData.restaurantTags,
			phone: restaurantData.phone,
			rating: restaurantData.restaurantRating,
			url: restaurantData.url || "",
			tables: restaurantData.tables || [],
			tablesFiltering: restaurantData.tablesFiltering,
		});
	}

	function allFavsModalCloseHandler() {
		setAllFavsModal((prev) => ({
			...prev,
			isOpen: false,
		}));
	}

	useEffect(() => {
		getUserData();
	}, []);

	return (
		<View style={styles.container}>
			<AllFavsModal
				data={allFavsModal.data}
				WIDTH={WIDTH}
				isVisible={allFavsModal.isOpen}
				isLoading={allFavsModal.isLoading}
				onClose={allFavsModalCloseHandler}
				onFavPress={(data) => onFavPressHandler(data, "modal")}
			/>

			<BackgroundImageWrapper
				WIDTH={WIDTH}
				bgColor={BACKGROUND_COLOR}
				uri={profileImage || "#"}
			>
				<LogoutButton onPress={logoutHandler} isReady={!isLoading} />

				<ProfileImage uri={profileImage || "#"} WIDTH={WIDTH} />

				<UserName name={currentUser.name} WIDTH={WIDTH} />

				<Stats
					WIDTH={WIDTH}
					upcoming={reservationsCounter.upcoming}
					total={reservationsCounter.total}
				/>
			</BackgroundImageWrapper>
			<View style={styles.menuContainer}>
				{isLoading ? (
					<ActivityIndicator size="large" color="#FFFFFF" />
				) : (
					<Favs
						WIDTH={WIDTH}
						favRestaurants={favRestaurants}
						onFavPress={onFavPressHandler}
						label="Favorites:"
						isMoreData={isMoreFavsToDisplay}
						onShowAllFavsPress={showAllFavsHandler}
					/>
				)}
			</View>
		</View>
	);
};

export default memo(Profile);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BACKGROUND_COLOR,
	},

	/////////// Bottom Half
	menuContainer: {
		flex: 0.5,
		backgroundColor: BACKGROUND_COLOR,
		width: WIDTH,
		alignItems: "center",
	},
	/////////////////////////
});

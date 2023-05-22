import {
	Animated,
	Dimensions,
	Easing,
	StyleSheet,
	View,
	Button,
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

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#1F1616";

const Profile = ({ navigation }) => {
	const userProfileRef = doc(db, "users", auth.currentUser.uid);
	const userReservationRef = collection(
		db,
		"users",
		auth.currentUser.uid,
		"reservations"
	);

	const [profileImage, setProfileImage] = useState();
	const [reservationsCounter, setReservationsCounter] = useState({
		active: 0,
		upcoming: 0,
		total: 0,
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
		});

		return () => {
			// Event listeners clearing
			unsubscribeFocus();
			unsubscribeBlur();
		};
	}, []);

	function logoutHandler() {
		dispatch(logoutUser());
		signOut(auth);
	}

	async function getUserData() {
		let imageItemName;

		const imageFolderRef = ref(
			storage,
			`users/${auth.currentUser.uid}/profilePic`
		);

		const list = await listAll(imageFolderRef);
		list.items.forEach((item) => (imageItemName = item.name));

		let upcomingReservations = 0;
		dispatch(getUser());
		const profileImageRef = ref(
			storage,
			`users/${auth.currentUser.uid}/profilePic/${imageItemName}`
		);

		const profileImgUri = await getDownloadURL(profileImageRef);

		setProfileImage(profileImgUri);

		// const snapshot = await getCountFromServer(userReservationRef);
		const querySnapshot = await getDocs(userReservationRef);

		const currentTimestamp = new Date().valueOf();

		querySnapshot.forEach((doc) => {
			if (doc.data().reservationDateTimestamp > currentTimestamp)
				++upcomingReservations;
		});

		const unsub = onSnapshot(userProfileRef, (doc) => {
			// console.log("Current data: ", doc.data());

			setReservationsCounter({
				// active: querySnapshot.docs.length,
				upcoming: upcomingReservations,
				total: doc.data().totalReservations,
			});
		});
	}

	function testHandler() {}

	useEffect(() => {
		getUserData();

		// console.log(currentUser);
	}, []);

	return (
		<View style={styles.container}>
			{profileImage && (
				<BackgroundImageWrapper
					WIDTH={WIDTH}
					bgColor={BACKGROUND_COLOR}
					uri={profileImage}
				>
					<LogoutButton onPress={logoutHandler} />

					<ProfileImage uri={profileImage} WIDTH={WIDTH} />

					<UserName name={currentUser.name} WIDTH={WIDTH} />

					<Stats
						WIDTH={WIDTH}
						upcoming={reservationsCounter.upcoming}
						total={reservationsCounter.total}
					/>
				</BackgroundImageWrapper>
			)}
			{/* <View style={styles.menuContainer}>
				<Button title="test" onPress={testHandler} />
			</View> */}
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
		justifyContent: "center",
		alignItems: "center",
	},
});

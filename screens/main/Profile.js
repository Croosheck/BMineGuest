import {
	Animated,
	Button,
	Dimensions,
	Easing,
	Image,
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser } from "../../redux/slices/user";

import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import LottieIcon from "../../components/LottieIcon";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../components/Icon";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

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
		total: 0,
		active: 0,
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
		dispatch(logoutUser);
		signOut(auth);
	}

	async function getUserData() {
		dispatch(getUser());
		const profileImageRef = ref(
			storage,
			`users/${auth.currentUser.uid}/profilePic/defaultProfile.jpg`
		);
		const profileImgUri = await getDownloadURL(profileImageRef);

		setProfileImage(profileImgUri);

		// const snapshot = await getCountFromServer(userReservationRef);
		// console.log(userReservationRef);
		const querySnapshot = await getDocs(userReservationRef);

		const unsub = onSnapshot(userProfileRef, (doc) => {
			// console.log("Current data: ", doc.data());
			setReservationsCounter({
				total: doc.data().totalReservations,
				active: querySnapshot.docs.length,
			});
		});
	}

	useEffect(() => {
		getUserData();

		// console.log(currentUser);
	}, []);

	async function testHandler() {}

	return (
		<View style={styles.container}>
			{profileImage && (
				<ImageBackground
					style={styles.profileBackgroundContainer}
					imageStyle={styles.profileBackground}
					source={{ uri: profileImage }}
					blurRadius={5}
					resizeMode="cover"
					resizeMethod="scale"
				>
					<LinearGradient
						colors={["#8E21496D", "#231717"]}
						style={styles.backdropGradient}
						start={{
							x: 0,
							y: 0.5,
						}}
						end={{
							x: 0,
							y: 1,
						}}
					>
						<Pressable
							onPress={logoutHandler}
							style={({ pressed }) => [
								styles.logoutButton,
								pressed && { opacity: 0.5 },
							]}
						>
							<Icon name="logout-variant" color="#ffffff" size={36} />
						</Pressable>
						<ImageBackground
							source={{ uri: profileImage }}
							style={styles.profileImageContainer}
							imageStyle={styles.profileImage}
							resizeMode="cover"
						/>
						<Text style={styles.userNameText}>{currentUser.name}</Text>
						<View style={styles.statsContainer}>
							<View style={styles.statContainer}>
								<Text style={styles.stat}>{reservationsCounter.active}</Text>
								<Text style={styles.statLabel}>Active Reservations</Text>
							</View>
							<View style={styles.statContainer}>
								<Text style={styles.stat}>{reservationsCounter.total}</Text>
								<Text style={styles.statLabel} numberOfLines={1}>
									Total Reservations
								</Text>
							</View>
						</View>
					</LinearGradient>
				</ImageBackground>
			)}
			<View style={styles.menuContainer}>
				{/* <Button title="test" onPress={testHandler} /> */}
			</View>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	/////////// Upper Half
	profileBackgroundContainer: {
		flex: 0.5,
		width: WIDTH,
		zIndex: 1,
		elevation: 20,

		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 1,
		shadowRadius: 15,
		overflow: "hidden",
	},
	profileBackground: {
		opacity: 0.8,
	},
	backdropGradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000021",
	},
	logoutButton: {
		position: "absolute",
		top: 0,
		right: 0,
		marginRight: 20,
		marginTop: 15,
	},
	profileImageContainer: {
		width: WIDTH * 0.4,
		aspectRatio: 1,
		borderRadius: WIDTH * 0.2,
		transform: [{ translateY: -25 }],
		overflow: "hidden",
	},
	profileImage: {
		transform: [{ scale: 1.2 }, { translateY: 10 }],
	},
	userNameText: {
		width: WIDTH,
		color: "#FFFFFF",
		fontSize: 22,
		fontWeight: "bold",
		textShadowColor: "#000000",
		textShadowOffset: { height: 2, width: 2 },
		textShadowRadius: 8,
		textAlign: "center",
	},
	statsContainer: {
		width: WIDTH,
		flexDirection: "row",
		transform: [{ translateY: 20 }],
		paddingVertical: 10,
		flexWrap: "wrap",
	},
	statContainer: {
		justifyContent: "center",
		alignItems: "center",
		minWidth: "33%",
		flexBasis: "auto",
		flexGrow: 1,
		flexShrink: 0,
	},
	stat: {
		color: "#ffffff",
		fontSize: 20,
	},
	statLabel: {
		color: "#FFFFFF79",
		fontSize: 12,
	},
	/////////// Bottom Half
	menuContainer: {
		flex: 0.5,
		backgroundColor: "#231717",
		width: WIDTH,
		justifyContent: "center",
		alignItems: "center",
	},
});

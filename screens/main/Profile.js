import {
	Animated,
	Button,
	Dimensions,
	Easing,
	Image,
	StyleSheet,
	View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/user";

import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import LottieIcon from "../../components/LottieIcon";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const Profile = ({ navigation }) => {
	const [profileImage, setProfileImage] = useState();

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

	useEffect(() => {
		async function getUserData() {
			const profileImageRef = ref(
				storage,
				`users/${auth.currentUser.uid}/profilePic/defaultProfile.jpg`
			);
			const profileImgUri = await getDownloadURL(profileImageRef);

			setProfileImage(profileImgUri);
		}

		getUserData();
	}, []);

	async function testHandler() {}

	return (
		<View style={styles.container}>
			{profileImage && (
				<Image source={{ uri: profileImage }} style={styles.profileImage} />
			)}
			<Button title="Logout" onPress={logoutHandler} />
			<Button title="test" onPress={testHandler} />
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
	},
	profileImage: {
		width: WIDTH * 0.5,
		height: WIDTH * 0.5,
		borderRadius: WIDTH * 0.25,
	},
});

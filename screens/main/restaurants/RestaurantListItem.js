import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Pressable,
	ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { getRestaurantProfileImage } from "../../../util/storage";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { useFonts } from "expo-font";

const BORDER_RADIUS = 8;

const RestaurantListItem = ({
	name = String(),
	category,
	reservationsStatus,
	onPress = () => {},
	restaurantUid = String(),
	restaurantEntering = () => {},
	titleEntering = () => {},
	restaurantNameEntering = () => {},
	rating = {
		sum: Number(),
		total: Number(),
	},
	ratingStyle = {
		bg: String(),
		text: String(),
		textShadow: String(),
	},
}) => {
	const [profileImgUri, setProfileImgUri] = useState();
	const [fontsLoaded] = useFonts({
		"PTS-Reg": require("../../../assets/fonts/PTSans-Regular.ttf"),
		"PTS-Bold": require("../../../assets/fonts/PTSans-Bold.ttf"),
		"TiltNeon-Reg": require("../../../assets/fonts/TiltNeon-Regular.ttf"),
		"Anton-Reg": require("../../../assets/fonts/Anton-Regular.ttf"),
		"SourceCodePro-SB": require("../../../assets/fonts/SourceCodePro-SemiBold.ttf"),
	});

	useEffect(() => {
		async function getRestaurantDataHandler() {
			const profileImage = await getRestaurantProfileImage(restaurantUid);
			setProfileImgUri(profileImage);
		}

		getRestaurantDataHandler();
	}, []);

	const ratingAvg = ((rating.sum ?? 0) / (rating.total ?? 0)).toFixed(1);

	return (
		<>
			{profileImgUri && (
				<Animated.View entering={restaurantEntering}>
					<LinearGradient
						style={styles.outerContainer}
						colors={["#000000CC", "#FFFFFF", "#020202B7"]}
						start={{ x: 1, y: 1 }}
						end={{ x: 0, y: 0 }}
					>
						<ImageBackground
							style={styles.container}
							source={{ uri: profileImgUri }}
						>
							<Pressable
								style={styles.pressableContainer}
								android_ripple={{ color: "#B1B1B135" }}
								onPress={onPress}
							>
								<Animated.View
									style={styles.nameContainer}
									entering={titleEntering}
								>
									<Animated.Text
										entering={restaurantNameEntering}
										style={styles.name}
									>
										{name}
									</Animated.Text>
								</Animated.View>
								<View
									style={[
										styles.ratingContainer,
										{ backgroundColor: ratingStyle.bg },
									]}
								>
									<Text
										style={[
											styles.ratingText,
											{
												color: ratingStyle.text,
												textShadowColor: ratingStyle.textShadow,
											},
										]}
									>{`${
										isNaN(ratingAvg) ? "No ratings" : ratingAvg + " / 5"
									}`}</Text>
								</View>
							</Pressable>
						</ImageBackground>
					</LinearGradient>
				</Animated.View>
			)}
		</>
	);
};

export default RestaurantListItem;

const styles = StyleSheet.create({
	outerContainer: {
		padding: 3,
		borderRadius: BORDER_RADIUS,
		marginHorizontal: Dimensions.get("window").width * 0.03,
		marginVertical: Dimensions.get("window").height * 0.02,
		backgroundColor: "#B6B6B6",
		// borderWidth: 2,
		borderColor: "#5B5B5B9B",
		elevation: 10,
		shadowColor: "#ffffff",
		shadowOpacity: 0.5,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 24,
	},
	container: {
		flex: 1,
		width: "100%",
		height: "100%",
		borderRadius: BORDER_RADIUS - 2,
		overflow: "hidden",
	},
	pressableContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: Dimensions.get("window").width * 0.65,
		borderRadius: BORDER_RADIUS - 2,
	},
	nameContainer: {
		backgroundColor: "#CCCCCC6E",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	name: {
		color: "#000000",
		fontSize: 24,
		fontWeight: "bold",
	},
	ratingContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		minWidth: "25%",
		paddingVertical: 2,
		paddingHorizontal: 6,
		justifyContent: "center",
		alignItems: "center",
		borderTopLeftRadius: BORDER_RADIUS * 0.5,
	},
	ratingText: {
		textShadowRadius: 6,
		fontFamily: "PTS-Bold",
		fontSize: 16,
	},
});

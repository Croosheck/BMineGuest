import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Pressable,
	ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";
import { getRestaurantProfileImage } from "../../util/storage";
import { LinearGradient } from "expo-linear-gradient";

const RestaurantListItem = ({
	name,
	imageUri,
	category,
	reservationsStatus,
	onPress,
	id,
	restaurantUid,
}) => {
	const [profileImgUri, setProfileImgUri] = useState();

	useEffect(() => {
		async function getRestaurantDataHandler() {
			const profileImage = await getRestaurantProfileImage(restaurantUid);
			setProfileImgUri(profileImage);
		}

		getRestaurantDataHandler();
	}, []);

	return (
		<LinearGradient
			style={styles.outerContainer}
			colors={["#000000CC", "#FFFFFF", "#020202B7"]}
			start={{ x: 1, y: 1 }}
			end={{ x: 0, y: 0 }}
		>
			<ImageBackground style={styles.container} source={{ uri: profileImgUri }}>
				<Pressable
					style={styles.pressableContainer}
					android_ripple={{ color: "#B1B1B135" }}
					onPress={onPress}
				>
					<View style={styles.nameContainer}>
						<Text style={styles.name}>{name}</Text>
					</View>
				</Pressable>
			</ImageBackground>
		</LinearGradient>
	);
};

export default RestaurantListItem;

const styles = StyleSheet.create({
	outerContainer: {
		padding: 3,
		borderRadius: 24,
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
		borderRadius: 20,
		overflow: "hidden",
	},
	pressableContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: Dimensions.get("window").width * 0.65,
		borderRadius: 20,
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
		fontSize: 24,
		fontWeight: "bold",
		color: "#000000",
	},
});

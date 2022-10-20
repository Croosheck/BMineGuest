import { Button, Dimensions, Image, StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/user";

import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const Profile = () => {
	const [profileImage, setProfileImage] = useState();

	const dispatch = useDispatch();

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

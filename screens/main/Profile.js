import { Button, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/user";

import { getAuth, signOut } from "firebase/auth";
import { auth, storage } from "../../firebase";

const Profile = () => {
	const dispatch = useDispatch();

	function logoutHandler() {
		dispatch(logoutUser);
		signOut(auth);
	}

	return (
		<View style={styles.container}>
			<Button title="Logout" onPress={logoutHandler} />
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
});

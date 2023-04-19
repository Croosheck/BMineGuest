import {
	Button,
	Dimensions,
	Image,
	StyleSheet,
	TextInput,
	View,
	Alert,
	Pressable,
	Text,
} from "react-native";
import React, { useEffect, useState } from "react";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import uploadData from "../../util/storage";

import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	useMediaLibraryPermissions,
} from "expo-image-picker";
import SignLogInput from "../../components/inputs/SignLogInput";

const CONTENT_WIDTH = 300;
const SUCCESS_ANIM_DURATION = 1000;

const Register = ({ onRegister }) => {
	const [credentials, setCredentials] = useState({
		name: "Josh",
		email: "888@888.com",
		password: "123123",
	});
	const [image, setImage] = useState(null);
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);

	const [status, requestPermission] = useMediaLibraryPermissions();

	async function pickImageHandler() {
		if (!status.granted) {
			const permissionStatus = await requestPermission();
			if (!permissionStatus.granted) return;
		}

		let result = await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.cancelled) {
			setImage(result.uri);
		}
	}

	function inputHandler(type, text) {
		type === "name" &&
			setCredentials((current) => ({ ...current, name: text }));
		type === "email" &&
			setCredentials((current) => ({ ...current, email: text }));
		type === "password" &&
			setCredentials((current) => ({ ...current, password: text }));
	}

	function showPasswordHandler() {
		setIsPasswordHidden((prev) => !prev);
	}

	function signUpHandler() {
		const { name, email, password } = credentials;

		if (
			name.trim().length === 0 ||
			email.trim().length === 0 ||
			password.trim().length === 0
		) {
			Alert.alert(
				"*Beep Boop!* Distorted data!",
				"Something is missing! Over."
			);
			return;
		}

		if (password.trim().length < 6) {
			Alert.alert(
				"*Beep Boop!* Password too short!",
				"Must be at least 6 characters. Over."
			);
			return;
		}

		if (!image) {
			Alert.alert(
				"*Beep Boop!* No image detected!",
				"Please pick your profile image. Over."
			);
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then(async (response) => {
				// in setDoc ID must be specified
				// await setDoc(doc(db, "users", auth.currentUser.uid), {
				// 	name: name,
				// 	email: email,
				// 	registrationTimestamp: serverTimestamp(),
				// }).catch((error) => {
				// 	Alert.alert("Something went wrong!", `${error.message}`);
				// });
			})
			.catch((error) => {
				Alert.alert("Something went wrong!", `${error.message}`);
			});

		getAuth().onAuthStateChanged((user) => {
			if (user) {
				setTimeout(() => {
					//authorizes the user to get an access to the account
					onRegister();
				}, SUCCESS_ANIM_DURATION);

				// uploadData(image, "userProfile");
			}
		});
	}

	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<Pressable onPress={pickImageHandler} style={[styles.imageContainer]}>
					{image && (
						<Image source={{ uri: image }} style={[styles.profileImage]} />
					)}
					{!image && <Text>Pick Profile Image</Text>}
				</Pressable>

				<View style={styles.inputsContainer}>
					<SignLogInput
						placeholder="name"
						onChangeText={inputHandler.bind(this, "name")}
						value={credentials.name}
					/>
					<SignLogInput
						placeholder="email"
						onChangeText={inputHandler.bind(this, "email")}
						value={credentials.email}
					/>
					<SignLogInput
						placeholder="password"
						onChangeText={inputHandler.bind(this, "password")}
						value={credentials.password}
						textContentType="password"
						isPasswordHidden={isPasswordHidden}
						icon="ios-eye-outline"
						iconColor="#000000"
						iconSize={22}
						onIconPress={showPasswordHandler}
					/>
				</View>
				<View style={styles.signUpButton}>
					<Button title="Sign Up" onPress={signUpHandler} />
				</View>
			</View>
		</View>
	);
};

export default Register;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	innerContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: CONTENT_WIDTH,
	},
	///////////////////////////////
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#BDBDBD",
		width: "80%",
		height: CONTENT_WIDTH * 0.8,
		borderWidth: 5,
		borderRadius: 10,
		overflow: "hidden",
		marginBottom: 50,
	},
	profileImage: {
		width: "100%",
		aspectRatio: 1,
	},
	///////////////////////////////
	inputsContainer: {
		width: "100%",
	},
	///////////////////////////////
	signUpButton: {},
});

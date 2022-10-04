import {
	Button,
	Dimensions,
	Image,
	StyleSheet,
	TextInput,
	View,
	Alert,
} from "react-native";
import React, { useState } from "react";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import uploadFile from "../../util/storage";

import * as ImagePicker from "expo-image-picker";

const Register = () => {
	const [credentials, setCredentials] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [image, setImage] = useState(null);

	async function pickImageHandler() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.cancelled) {
			setImage(result.uri);
		}
	}

	const pickedImage = !image ? (
		<View style={styles.buttonContainer}>
			<Button title="Pick Profile Image" onPress={pickImageHandler} />
		</View>
	) : (
		<View style={[styles.outerCircleImageMasked, { opacity: 1 }]}>
			<Image
				source={{ uri: image }}
				style={[styles.imageMasked, { opacity: 1 }]}
			/>
		</View>
	);

	function inputHandler(type, text) {
		type === "name" &&
			setCredentials((current) => ({ ...current, name: text }));
		type === "email" &&
			setCredentials((current) => ({ ...current, email: text }));
		type === "password" &&
			setCredentials((current) => ({ ...current, password: text }));
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
				"Profile image detection failed. Over."
			);
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then(async (response) => {
				// in setDoc ID must be specified
				await setDoc(doc(db, "users", auth.currentUser.uid), {
					name: name,
					email: email,
					registrationTimestamp: serverTimestamp(),
				}).catch((error) => {
					Alert.alert("Something went wrong!", `${error.message}`);
				});
			})
			.catch((error) => {
				Alert.alert("Something went wrong!", `${error.message}`);
			});

		getAuth().onAuthStateChanged((user) => {
			if (user) {
				uploadFile(image, "profilePic");
			}
		});
	}

	return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				{pickedImage}
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder="name"
						onChangeText={inputHandler.bind(this, "name")}
					/>
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder="email"
						onChangeText={inputHandler.bind(this, "email")}
					/>
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder="password"
						onChangeText={inputHandler.bind(this, "password")}
					/>
				</View>
				<View>
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
	maskedViewContainer: {
		flex: 1,
	},
	innerContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	outerCircleImageMasked: {
		justifyContent: "center",
		alignItems: "center",
		width: Dimensions.get("window").width / 1.65, // A 1
		height: Dimensions.get("window").width / 1.65, // A 2
		borderRadius: Dimensions.get("window").width / 3,
		borderWidth: 7,
		marginBottom: 12,
	},
	imageMasked: {
		width: Dimensions.get("window").width / 1.58, // B 1
		height: Dimensions.get("window").width / 1.58, // B 2
		borderRadius: Dimensions.get("window").width / 3.1, // B 3
	},
	// if WxH in imageMasked > WxH in imageBackgroundContainer, masked ring is inside image
	imageBackgroundContainer: {
		width: Dimensions.get("window").width / 1.65, // A 1
		height: Dimensions.get("window").width / 1.65, // A 2
		marginBottom: 12,
	},
	backgroundImageStyle: {
		borderWidth: 8,
		borderColor: "#220E0E",
		borderRadius: Dimensions.get("window").width / 3,
	},
	innerView: {
		//////// Applicable, if WxH in imageMasked > WxH in imageBackgroundContainer
		// width: Dimensions.get("window").width / 1.85, // B 1
		// height: Dimensions.get("window").width / 1.85, // B 2
		// borderRadius: Dimensions.get("window").width / 3.7, // B 3
	},
	inputContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 8,
		marginVertical: 8,
		height: 40,
		width: "60%",
		borderWidth: 1,
		borderRadius: 14,
		backgroundColor: "#DFDFDF",
		borderWidth: 1,
	},
	input: {
		width: "100%",
		fontWeight: "bold",
	},
	buttonContainer: {
		width: "50%",
		marginBottom: 80, // top button
		marginTop: 24, // bottom button
	},
	backgroundImage: {
		width: "100%",
		height: "100%",
	},
});

import {
	Button,
	Image,
	StyleSheet,
	View,
	Alert,
	Pressable,
	Text,
	Dimensions,
	KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";

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
import IconButton from "../../components/IconButton";
import { LinearGradient } from "expo-linear-gradient";
import OutlinedButton from "../../components/OutlinedButton";

const CONTENT_SIZE = Dimensions.get("window").width * 0.8;
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
		<LinearGradient
			style={styles.container}
			colors={["#00000018", "#ffffff", "#00000063"]}
			start={{
				x: 0.1,
				y: 0.1,
			}}
			end={{
				x: 1,
				y: 1,
			}}
		>
			<View style={styles.innerContainer}>
				<View style={styles.imageContainer}>
					<Pressable
						onPress={pickImageHandler}
						style={styles.imagePressableContainer}
						android_ripple={{ color: "#CCCCCC69" }}
					>
						{image && (
							<Image source={{ uri: image }} style={[styles.profileImage]} />
						)}
						{!image && (
							<>
								<Text style={styles.imageLabel}>Pick Profile Image</Text>
								<IconButton
									icon="folder-open-outline"
									onPress={pickImageHandler}
									size={32}
									color="#888888"
								/>
							</>
						)}
					</Pressable>
				</View>

				<KeyboardAvoidingView
					style={styles.inputsContainer}
					behavior="position"
				>
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
				</KeyboardAvoidingView>

				<OutlinedButton
					title="Create Account"
					onPress={signUpHandler}
					innerStyle={styles.signUpButton}
					titleStyle={{
						fontSize: 18,
					}}
				/>
			</View>
		</LinearGradient>
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
		width: CONTENT_SIZE,
		maxWidth: 300,
	},
	///////////////////////////////
	imageContainer: {
		width: CONTENT_SIZE * 0.8,
		marginBottom: 50,
		aspectRatio: 1,
		borderWidth: 1,
		borderColor: "#DEDEDE",
		borderRadius: 5,
		overflow: "hidden",
		backgroundColor: "#ffffff",
	},
	imagePressableContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},
	profileImage: {
		width: "100%",
		aspectRatio: 1,
	},
	imageLabel: {
		fontSize: 16,
		color: "#888888",
	},
	///////////////////////////////
	inputsContainer: {
		width: "100%",
		marginBottom: 20,
	},
	///////////////////////////////
	signUpButton: {
		paddingVertical: 8,
		paddingHorizontal: 15,
	},
});

import {
	Animated as Anim,
	Button,
	Easing,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import React, { useState } from "react";

import { auth, db } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import LottieView from "lottie-react-native";
import { useRef } from "react";
import { useEffect } from "react";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import IconButton from "../../components/IconButton";
import { LinearGradient } from "expo-linear-gradient";

const ANIM_DURATION = 1000;

const Login = ({ areCredentialsValid = Boolean(), onLogin = () => {} }) => {
	const [credentials, setCredentials] = useState({});
	const [error, setError] = useState({
		isError: false,
		errorMessage: "",
	});
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);

	const animationProgress = useRef(new Anim.Value(0.35));

	const buttonAnimatedTranslateX = useSharedValue(0);
	const lottieAnimatedRotateZ = useSharedValue(0);

	const reanimatedButtonStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: buttonAnimatedTranslateX.value }],
	}));
	const reanimatedLottieStyle = useAnimatedStyle(() => ({
		transform: [{ rotateZ: `${lottieAnimatedRotateZ.value}deg` }],
	}));

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

	useEffect(() => {
		if (areCredentialsValid) {
			Anim.timing(animationProgress.current, {
				toValue: 0.5,
				duration: ANIM_DURATION,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		}
	}, [areCredentialsValid]);

	async function signUpHandler() {
		if (error.isError) return;

		// Logging it with email/password
		const { email, password } = credentials;
		const response = await signInWithEmailAndPassword(
			auth,
			email,
			password
		).catch((error) => {
			setError({
				isError: true,
				errorMessage: "Check your credentials and try again.",
			});

			buttonAnimatedTranslateX.value = withSequence(
				withTiming(10, { duration: 120 }),
				withTiming(-8, { duration: 140 }),
				withTiming(5, { duration: 160 }),
				withTiming(-3, { duration: 190 }),
				withTiming(0, { duration: 220 })
			);
			lottieAnimatedRotateZ.value = withSequence(
				withTiming(20, { duration: 120 }),
				withTiming(-15, { duration: 140 }),
				withTiming(10, { duration: 160 }),
				withTiming(-5, { duration: 190 }),
				withTiming(0, { duration: 220 })
			);

			setTimeout(() => {
				setError({
					isError: false,
					errorMessage: "",
				});
			}, 2000);

			return;
		});

		getAuth().onAuthStateChanged(async (user) => {
			// Before updating a doc, check if user successfully logged in
			if (user) {
				lottieAnimatedRotateZ.value = withTiming(-20, { duration: 200 });

				onLogin(ANIM_DURATION);

				// Updates (or creates, if 1st time logging in) log in timestamp field in firestore doc
				await updateDoc(doc(db, "users", auth.currentUser.uid), {
					lastTimeLoggedIn: serverTimestamp(),
				}).catch((error) => {});
			}
		});
	}

	function buttonStatusGradient() {
		if (error.isError) return ["#FFFFFF", "#FF9898"];
		if (areCredentialsValid) return ["#FFFFFF", "#FFD66F"];

		return ["#FFFFFF", "#CCCCCC"];
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
			{!"" && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						width: "90%",
						marginBottom: 50,
					}}
				>
					<View>
						<Button
							title="jack"
							onPress={() =>
								setCredentials({ email: "jack@jack.com", password: "123123" })
							}
						/>
						<Text>0 reservations</Text>
					</View>
					<View>
						<Button
							title="jimmy"
							onPress={() =>
								setCredentials({ email: "test@test.com", password: "123123" })
							}
						/>
						<Text>Only upcoming</Text>
					</View>
					<View>
						<Button
							title="jessie"
							onPress={() =>
								setCredentials({ email: "111@111.com", password: "111111" })
							}
						/>
						<Text>Only expired</Text>
					</View>
				</View>
			)}

			<View style={styles.inputContainer}>
				<TextInput
					placeholder="email"
					onChangeText={inputHandler.bind(this, "email")}
					value={credentials.email}
					style={styles.input}
					textContentType="username"
				/>
			</View>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="password"
					onChangeText={inputHandler.bind(this, "password")}
					value={credentials.password}
					style={styles.input}
					textContentType="password"
					secureTextEntry={isPasswordHidden}
				/>
				<IconButton
					icon="ios-eye-outline"
					color="#000000"
					size={22}
					onPress={showPasswordHandler}
				/>
			</View>
			<Text>{error.errorMessage}</Text>

			<Animated.View
				style={[
					styles.lottieButtonContainer,
					reanimatedButtonStyle,
					error.isError && styles.lottieError,
					areCredentialsValid && styles.lottieSuccess,
				]}
			>
				<LinearGradient colors={buttonStatusGradient()}>
					<Pressable
						onPress={signUpHandler}
						android_ripple={{ color: "#CCCCCC6B" }}
						style={{
							padding: 4,
						}}
					>
						<Animated.View style={reanimatedLottieStyle}>
							<LottieView
								source={require("../../assets/lottie/lottieLogin2.json")}
								progress={animationProgress.current}
								style={styles.lottieButton}
								resizeMode="cover"
							/>
						</Animated.View>
					</Pressable>
				</LinearGradient>
			</Animated.View>
		</LinearGradient>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	inputContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: 10,
		marginVertical: 8,
		height: 40,
		width: "60%",
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		height: 40,
		width: 300,
		elevation: 6,
		shadowColor: "#00000085",
		shadowRadius: 10,
		shadowOffset: { height: 2, width: 2 },
	},
	input: {
		flex: 1,
		color: "#000000",
		fontSize: 16,
	},
	buttonContainer: {
		marginTop: 16,
		width: "30%",
	},
	lottieButtonContainer: {
		backgroundColor: "#E9E9E9",
		borderRadius: 15,
		overflow: "hidden",
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#D4D4D4",
	},
	lottieError: {
		backgroundColor: "#FFAAAA",
	},
	lottieSuccess: {
		backgroundColor: "#D9FFEF",
	},

	lottieButton: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
});

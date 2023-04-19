import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import { auth, db } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { LinearGradient } from "expo-linear-gradient";
import SignLogInput from "../../components/inputs/SignLogInput";
import LottieAnimButton from "../../components/inputs/buttons/LottieAnimButton";

const ANIM_DURATION = 1000;

const Login = ({ areCredentialsValid = Boolean(), onLogin = () => {} }) => {
	const [credentials, setCredentials] = useState({});
	const [error, setError] = useState({
		isError: false,
		errorMessage: "",
	});
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);

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
				onLogin(ANIM_DURATION);

				// Updates (or creates, if 1st time logging in) log in timestamp field in firestore doc
				await updateDoc(doc(db, "users", auth.currentUser.uid), {
					lastTimeLoggedIn: serverTimestamp(),
				}).catch((error) => {});
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

			<SignLogInput
				placeholder="email"
				onChangeText={inputHandler.bind(this, "email")}
				value={credentials.email}
				textContentType="username"
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
			<Text>{error.errorMessage}</Text>

			<LottieAnimButton
				error={error}
				isSuccess={areCredentialsValid}
				onLottiePress={signUpHandler}
				successDuration={ANIM_DURATION}
				lottieSource={require("../../assets/lottie/lottieLogin2.json")}
			/>
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
});

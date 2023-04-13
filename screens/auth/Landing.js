import { Button, ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import OutlinedButton from "../../components/OutlinedButton";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Landing = ({ navigation }) => {
	function registerPageHandler() {
		navigation.navigate("Register");
	}
	function loginPageHandler() {
		navigation.navigate("Login");
	}

	return (
		<ImageBackground
			style={styles.container}
			imageStyle={styles.backgroundImage}
			source={require("../../assets/background/Landing/background.jpg")}
		>
			<Image
				style={styles.image}
				source={require("../../assets/background/Landing/1.png")}
			/>
			<View style={styles.buttons}>
				<OutlinedButton
					title="Register"
					onPress={registerPageHandler}
					style={styles.button}
					titleStyle={{ fontSize: 18 }}
				/>
				<OutlinedButton
					title="Login"
					onPress={loginPageHandler}
					style={styles.button}
					titleStyle={{ fontSize: 18 }}
				/>
			</View>
		</ImageBackground>
	);
};

export default Landing;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#232323",
	},
	backgroundImage: {
		opacity: 0.7,
	},
	image: {
		width: "100%",
		height: 500,
		transform: [{ translateY: 100 }],
		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	buttons: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-around",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
		height: "20%",
		// borderWidth: 1,
	},
	button: {
		maxWidth: "40%",
		maxHeight: "30%",
	},
});

import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

const Landing = ({ navigation }) => {
	function registerPageHandler() {
		navigation.navigate("Register");
	}
	function loginPageHandler() {
		navigation.navigate("Login");
	}

	return (
		<View style={styles.container}>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Button title="Register" onPress={registerPageHandler} />
				</View>
				<View style={styles.button}>
					<Button title="Login" onPress={loginPageHandler} />
				</View>
			</View>
		</View>
	);
};

export default Landing;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	buttons: {
		flexDirection: "row",
		width: "55%",
		justifyContent: "space-between",
		// borderWidth: 1,
	},
	button: {
		minWidth: "25%",
	},
});

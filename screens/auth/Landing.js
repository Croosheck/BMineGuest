import { ImageBackground, StyleSheet, Image, View, Button } from "react-native";
import OutlinedButton from "../../components/OutlinedButton";

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
			{/* <Image
				style={styles.image}
				source={require("../../assets/background/Landing/1.png")}
				resizeMode="contain"
			/> */}
			<View style={styles.buttons}>
				<OutlinedButton
					title="Register"
					onPress={registerPageHandler}
					style={styles.buttonStyle}
					innerStyle={styles.buttonInner}
					titleStyle={{ fontSize: 18 }}
				/>
				<OutlinedButton
					title="Login"
					onPress={loginPageHandler}
					style={styles.buttonStyle}
					innerStyle={styles.buttonInner}
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
		maxWidth: "100%",
		maxHeight: "100%",
		opacity: 0.9,
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
	},
	buttonStyle: {
		width: "35%",
		minWidth: 150,
		maxWidth: 200,
	},
	buttonInner: {
		width: "100%",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
});

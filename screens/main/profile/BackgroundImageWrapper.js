import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";
import { StyleSheet } from "react-native";

const BackgroundImageWrapper = ({
	uri,
	blur = 5,
	bgColor = "",
	WIDTH = Number(),
	children,
}) => {
	return (
		<ImageBackground
			style={[styles.profileBackgroundContainer, { width: WIDTH }]}
			imageStyle={styles.profileBackground}
			source={{ uri: uri }}
			blurRadius={blur}
			resizeMode="cover"
			resizeMethod="scale"
		>
			<LinearGradient
				colors={["#8E21496D", bgColor]}
				style={styles.backdropGradient}
				start={{
					x: 0,
					y: 0.5,
				}}
				end={{
					x: 0,
					y: 1,
				}}
			>
				{children}
			</LinearGradient>
		</ImageBackground>
	);
};

export default BackgroundImageWrapper;

const styles = StyleSheet.create({
	profileBackgroundContainer: {
		flex: 0.5,
		zIndex: 1,
		elevation: 20,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 1,
		shadowRadius: 15,
		overflow: "hidden",
	},
	profileBackground: {
		opacity: 0.8,
	},
	backdropGradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000058",
	},
});

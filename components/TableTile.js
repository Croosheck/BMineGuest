import {
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Image,
} from "react-native";
import Icon from "./Icon";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import defaultImg from "../assets/imagePlaceholders/default.jpg";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const TableTile = ({
	seatsQuantity,
	onPress,
	picked,
	iconName,
	iconSize,
	iconColor,
	imgUri,
	tPlacement,
}) => {
	const [imageSize, setImageSize] = useState({
		width: 0,
		height: 0,
	});

	function getImageSizeHandler() {
		Image.getSize(
			imgUri,
			(width, height) =>
				setImageSize({
					width,
					height,
				}),
			(error) => console.log(error)
		);
	}

	const imgRatio = imageSize.width / imageSize.height;
	const imageScale = imgRatio > 1.55 ? imgRatio : 1.45;

	return (
		<View style={[styles.container, picked && styles.containerPicked]}>
			<LinearGradient colors={["#8686862F", "#000000AF"]}>
				<Pressable
					style={[styles.innerContainer, picked && styles.itemPicked]}
					onPress={onPress}
					android_ripple={{ color: "#8C6D6D19" }}
				>
					<View style={[styles.labelContainer]}>
						<View style={styles.textBelowContainer}>
							{iconName && (
								<Icon name={iconName} size={iconSize} color={iconColor} />
							)}
							<Text
								style={[
									styles.seatsQuantity,
									styles.textShadow,
									picked && { color: "#FFFFFF" },
								]}
							>
								{seatsQuantity}
							</Text>
						</View>

						<Text
							style={[
								styles.textBelow,
								styles.textShadow,
								picked && { color: "#FFFFFF" },
							]}
						>
							{tPlacement}
						</Text>
					</View>
					<ImageBackground
						style={[
							styles.imageBackgroundContainer,
							picked && styles.imageBackgroundContainerPicked,
						]}
						source={
							imgUri
								? { uri: imgUri }
								: require("../assets/imagePlaceholders/default.jpg")
						}
						onLoadEnd={() => getImageSizeHandler()}
						imageStyle={[
							styles.imageBackground,
							{
								transform: [
									{ rotate: "-25deg" },
									{ scale: imageScale },
									{ translateX: -WIDTH * 0.02 },
									{ translateY: -WIDTH * 0.05 },
								],
							},
							picked && {
								opacity: 1,
								transform: [
									{ rotate: "-25deg" },
									{ scale: imageScale + 0.2 },
									{ translateX: -WIDTH * 0.04 },
									{ translateY: -WIDTH * 0.05 },
								],
							},
						]}
						resizeMode="center"
					></ImageBackground>
				</Pressable>
			</LinearGradient>
		</View>
	);
};

export default TableTile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		borderRadius: 32,
		margin: 8,
		marginVertical: 15,
		backgroundColor: "#8080801E",
		height: HEIGHT * 0.22,
		opacity: 0.8,
	},
	containerPicked: {
		elevation: 8,
		shadowColor: "#FFFFFF",
		//opacity: 1 crashes the elevation (RN's bug? Or I'm dumb, who knows.)
		opacity: 0.99,
		//ios
		shadowOffset: { height: 3, width: 3 },
		shadowRadius: 5,
		shadowOpacity: 1,
	},
	imageBackgroundContainer: {
		flex: 1,
		width: "100%",
		height: 350,
		backgroundColor: "transparent",
		transform: [
			{ rotate: "25deg" },
			{ scale: 1.1 },
			{ translateX: WIDTH * 0.05 },
		],
		// oblique line
		borderWidth: 1,
		borderColor: "#FBFBFB",

		overflow: "hidden",
	},
	imageBackgroundContainerPicked: {
		borderWidth: 3,
	},
	imageBackground: {
		width: "100%",
		height: "110%",
		opacity: 0.5,
	},
	itemPicked: {
		flex: 1,
		width: "100%",
		backgroundColor: "#4400FF20",
		// borderWidth: 1,
		opacity: 1,
		borderColor: "#ffffff",
		borderRadius: 32,
	},
	innerContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		overflow: "hidden",
	},
	labelContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		paddingVertical: 5,
	},

	textBelowContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	seatsQuantity: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
		textAlign: "center",
		minWidth: "10%",
	},
	textBelow: {
		fontSize: 16,
		fontWeight: "300",
		color: "#ffffff",
		textAlign: "center",
		minWidth: "10%",
	},
	textShadow: {
		textShadowColor: "#FFFFFF98",
		textShadowOffset: { height: 2, width: 1 },
		textShadowRadius: 4,
	},
});

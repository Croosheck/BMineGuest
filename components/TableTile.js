import {
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
	ImageBackground,
} from "react-native";
import Icon from "./Icon";

const TableTile = ({
	title,
	seatsQuantity,
	onPress,
	picked,
	availability,
	iconName,
	iconSize,
	iconColor,
	imgUri,
	tPlacement,
}) => {
	return (
		<View style={[styles.container, picked && styles.containerPicked]}>
			<Pressable
				style={[styles.innerContainer, picked && styles.itemPicked]}
				onPress={onPress}
				android_ripple={{ color: "#8C6D6D19" }}
			>
				<View style={[styles.labelContainer]}>
					{/* <View style={styles.titleContainer}>
						<Text style={[styles.title, picked && { color: "#FFFFFF" }]}>
							{title}
						</Text>
					</View> */}
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
					source={{ uri: imgUri }}
					imageStyle={[
						styles.imageBackground,
						picked && styles.imageBackgroundPicked,
					]}
					resizeMode="center"
				>
					<View></View>
				</ImageBackground>
			</Pressable>
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
		// borderWidth: 2,
		borderColor: "#ffffff",
		margin: 8,
		marginVertical: 15,
		backgroundColor: "#8080801E",
		height: Dimensions.get("window").width * 0.43,
		opacity: 0.8,
	},
	containerPicked: {
		elevation: 8,
		shadowColor: "#ffffff",
		//opacity: 1 crashes the elevation (RN's bug? Or I'm dumb, who knows.)
		opacity: 0.99,
	},
	imageBackgroundContainer: {
		flex: 1,
		width: "100%",
		height: 350,
		backgroundColor: "transparent",
		transform: [
			{ rotate: "25deg" },
			{ scale: 1.1 },
			{ translateX: Dimensions.get("window").width * 0.05 },
		],
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
		transform: [
			{ rotate: "-25deg" },
			{ scale: 1.3 },
			{ translateX: -Dimensions.get("window").width * 0.02 },
			{ translateY: -Dimensions.get("window").width * 0.05 },
		],
	},
	imageBackgroundPicked: {
		opacity: 1,
		transform: [
			{ rotate: "-25deg" },
			{ scale: 1.5 },
			{ translateX: -Dimensions.get("window").width * 0.04 },
			{ translateY: -Dimensions.get("window").width * 0.05 },
		],
	},
	itemPicked: {
		flex: 1,
		width: "100%",
		backgroundColor: "#AB797933",
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
	titleContainer: {},
	title: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
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
		// backgroundColor: "#cccccc",
		textAlign: "center",
		minWidth: "10%",
	},
	textBelow: {
		fontSize: 16,
		fontWeight: "300",
		color: "#ffffff",
		// backgroundColor: "#cccccc",
		textAlign: "center",
		minWidth: "10%",
	},
	textShadow: {
		textShadowColor: "#FFFFFF98",
		textShadowOffset: { height: 2, width: 1 },
		textShadowRadius: 4,
	},
});

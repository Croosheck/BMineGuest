import {
	Dimensions,
	Pressable,
	StyleSheet,
	Text,
	View,
	ImageBackground,
} from "react-native";
import Icon from "./Icon";
import { memo } from "react";

const BORDER_RADIUS = 32;

const ItemTile = ({
	title,
	textBelow,
	onPress,
	picked,
	availability,
	iconName,
	iconSize,
	iconColor,
	imgUri,
}) => {
	return (
		<ImageBackground
			style={styles.container}
			source={{ uri: imgUri }}
			imageStyle={[
				styles.imageBackground,
				picked && styles.imageBackgroundPicked,
			]}
		>
			<Pressable
				style={[styles.innerContainer, picked && styles.itemPicked]}
				onPress={onPress}
				android_ripple={{ color: "#8C6D6D91" }}
			>
				<View
					style={[styles.labelContainer, picked && styles.labelContainerPicked]}
				>
					<View style={styles.titleContainer}>
						<Text style={[styles.title, picked && { color: "#FFFFFF" }]}>
							{title}
						</Text>
					</View>
					<View style={styles.textBelowContainer}>
						{iconName && (
							<Icon name={iconName} size={iconSize} color={iconColor} />
						)}
						<Text style={[styles.textBelow, picked && { color: "#FFFFFF" }]}>
							{" "}
							{textBelow}
						</Text>
					</View>
				</View>
			</Pressable>
		</ImageBackground>
	);
};

export default memo(ItemTile);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		borderRadius: BORDER_RADIUS,
		// borderWidth: 2,
		borderColor: "#ffffff",
		margin: 6,
		backgroundColor: "#95818117",
		height: Dimensions.get("window").width * 0.4,
	},
	imageBackground: {
		height: "80%",
		aspectRatio: 1,
		top: undefined,
		left: undefined,
		right: undefined,
		bottom: undefined,
		opacity: 0.3,
	},
	imageBackgroundPicked: {
		opacity: 1,
	},
	itemPicked: {
		width: "100%",
		backgroundColor: "#FFFFFF1E",
		// borderWidth: 1,
		opacity: 1,
		borderColor: "#ffffff",
		borderRadius: BORDER_RADIUS,
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	labelContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		paddingVertical: 5,
	},
	labelContainerPicked: {
		// backgroundColor: "#00000057",
	},
	titleContainer: {},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#ffffff",
		textShadowColor: "#000000",
		textShadowOffset: { height: 2, width: 2 },
		textShadowRadius: 7,
		minWidth: "100%",
		textAlign: "center",
		height: 30,
	},
	textBelowContainer: {
		flexDirection: "row",
	},
	textBelow: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
		textShadowColor: "#000000",
		textShadowOffset: { height: 2, width: 2 },
		textShadowRadius: 7,
		minWidth: "100%",
		textAlign: "center",
	},
});

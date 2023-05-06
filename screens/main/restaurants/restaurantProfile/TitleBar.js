import { StyleSheet, Text, View } from "react-native";

const TitleBar = ({ name = "", marginLeft = 0, height = 14 }) => {
	const restaurantTitleDynamicFontSize = name.length < 22 ? 24 : 20;

	return (
		<View style={styles.titleOuterContainer}>
			<View style={[styles.titleContainer, { height: height }]}>
				<Text
					style={[
						styles.title,
						{
							fontSize: restaurantTitleDynamicFontSize,
							marginLeft: marginLeft,
						},
					]}
				>
					{name}
				</Text>
			</View>
		</View>
	);
};

export default TitleBar;

const styles = StyleSheet.create({
	titleOuterContainer: {
		flexDirection: "row",

		// borderWidth: 2,
		// borderColor: "#ffffff",
	},
	titleContainer: {
		width: "100%",
		alignItems: "flex-start",
		justifyContent: "center",

		backgroundColor: "#12243D1E",
	},
	title: {
		color: "#ffffff",
		fontWeight: "900",
		letterSpacing: 0.7,
		width: "100%",

		textShadowColor: "#000000B1",
		textShadowRadius: 5,
		textShadowOffset: { width: 3, height: 2 },
	},
});

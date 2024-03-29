import { ScrollView, StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../util/normalizeFontSize";

const Description = ({ description = "", marginLeft = 0, marginRight = 0 }) => {
	return (
		<View
			style={[
				styles.descriptionContainer,
				{ marginLeft: marginLeft, marginRight: marginRight },
			]}
		>
			<ScrollView style={styles.descriptionInnerContainer}>
				<Text style={[styles.description, { fontSize: normalizeFontSize(15) }]}>
					{description}
				</Text>
			</ScrollView>
		</View>
	);
};

export default Description;

const styles = StyleSheet.create({
	descriptionContainer: {
		flex: 0.3,
		justifyContent: "center",
		marginBottom: 15,
		paddingBottom: 15,
		borderBottomWidth: 0.5,
		borderColor: "#cccccc",
	},
	descriptionInnerContainer: {},
	description: {
		color: "#ffffff",
		fontStyle: "italic",
		letterSpacing: 0.4,
		textShadowColor: "#FFFFFFCD",
		textShadowRadius: 3,
	},
});

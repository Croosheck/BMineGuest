import { ScrollView, StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../util/normalizeFontSize";

const Tags = ({ restaurantTags = [{ tagName: "" }], marginLeft = 0 }) => {
	return (
		<View style={styles.tagsContainer}>
			<ScrollView
				contentContainerStyle={[styles.tagsContent, { marginLeft: marginLeft }]}
				horizontal
			>
				{restaurantTags.map((tag, i) => (
					<Text
						style={[styles.tag, { fontSize: normalizeFontSize(14) }]}
						key={i}
					>
						{tag.tagName}
					</Text>
				))}
			</ScrollView>
		</View>
	);
};

export default Tags;

const styles = StyleSheet.create({
	tagsContainer: {
		width: "100%",
	},
	tagsContent: {
		marginVertical: 15,
		paddingRight: 20,
	},
	tag: {
		marginRight: 7,
		// backgroundColor: "#171F30",
		backgroundColor: "#4F8BA4",
		paddingHorizontal: 12,
		paddingVertical: 1,
		paddingBottom: 2,
		borderRadius: 20,
		fontWeight: "600",
		color: "#ffffff",

		textShadowColor: "#000000AF",
		textShadowRadius: 3,
	},
});

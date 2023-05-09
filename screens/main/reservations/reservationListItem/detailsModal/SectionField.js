import { StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../../util/normalizeFontSize";

const SectionField = ({ label = "", content = "", style = {} }) => {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.innerContainer}>
				<Text style={[styles.content, { fontSize: normalizeFontSize(16) }]}>
					{content}
				</Text>
				<Text
					style={[styles.label, { fontSize: normalizeFontSize(10) }]}
					numberOfLines={1}
				>
					{label}
				</Text>
			</View>
		</View>
	);
};

export default SectionField;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	innerContainer: {
		gap: 5,
		alignItems: "center",
	},
	label: {
		textTransform: "uppercase",
		fontWeight: "600",
		color: "#656565",
		letterSpacing: 0.7,
	},
	content: {
		fontWeight: "500",
	},
});

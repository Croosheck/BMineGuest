import { StyleSheet, Text, View } from "react-native";

const SectionField = ({ label = "", content = "", style = {} }) => {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.innerContainer}>
				<Text style={styles.content}>{content}</Text>
				<Text style={styles.label} numberOfLines={1}>
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
		fontSize: 10,
	},
	content: {
		fontWeight: "500",
		fontSize: 15,
	},
});

import { StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../util/normalizeFontSize";

const Stat = ({ data = Number(), label = "" }) => {
	return (
		<View style={styles.container}>
			<Text style={[styles.data, { fontSize: normalizeFontSize(20) }]}>
				{data ?? 0}
			</Text>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
};

export default Stat;

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		minWidth: "33%",
		flexBasis: "auto",
		flexGrow: 1,
		flexShrink: 0,
	},
	data: {
		color: "#ffffff",
	},
	label: {
		color: "#FFFFFF79",
		fontSize: 12,
	},
});

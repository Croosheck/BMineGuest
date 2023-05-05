import { StyleSheet, Text, View, Pressable } from "react-native";

const Example = ({ onPress = () => {}, title = "", active = Boolean() }) => {
	return (
		<View style={styles.container}>
			<Pressable
				onPress={onPress}
				style={[styles.button, active && { backgroundColor: "#126CD498" }]}
				android_ripple={{ color: "#CCCCCC10" }}
			>
				<Text style={styles.label}>{title}</Text>
			</Pressable>
		</View>
	);
};

export default Example;

const styles = StyleSheet.create({
	container: {
		// borderWidth: 1,
		// borderColor: "#ffffff",

		borderRadius: 10,
		width: 60,
		height: 35,
		overflow: "hidden",
		backgroundColor: "#FFFFFF09",
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	label: {
		color: "#ffffff",
		fontSize: 15,
		fontWeight: "bold",
	},
});

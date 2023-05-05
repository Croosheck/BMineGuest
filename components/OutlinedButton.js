import { Pressable, StyleSheet, Text, View } from "react-native";

const OutlinedButton = ({
	title = "",
	onPress = () => {},
	style = {},
	innerStyle = {},
	titleStyle = {},
}) => {
	return (
		<View style={[styles.container, style]}>
			<Pressable
				style={({ pressed }) => [
					styles.innerContainer,
					pressed && styles.pressed,
					innerStyle,
				]}
				android_ripple={{ color: "#7B7B7B56" }}
				onPress={onPress}
			>
				<Text style={[styles.title, titleStyle]}>{title}</Text>
			</Pressable>
		</View>
	);
};

export default OutlinedButton;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "#ffffff",
		borderRadius: 10,
		overflow: "hidden",
	},
	innerContainer: {},
	pressed: {
		opacity: 0.7,
	},
	title: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		bottom: "4%",
	},
});

import { Pressable, StyleSheet, Text } from "react-native";

const FilterButton = ({ title, onPress, style, titleStyle, disPressAnim }) => {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.innerContainer,
				pressed && !disPressAnim && styles.pressed,
				style,
			]}
			onPress={onPress}
		>
			<Text style={[styles.title, titleStyle]}>{title}</Text>
		</Pressable>
	);
};

export default FilterButton;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: "hidden",
	},
	innerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	pressed: {
		opacity: 0.5,
	},
	title: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		bottom: "4%",
	},
});

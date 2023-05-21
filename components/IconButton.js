import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IconButton = ({
	icon = "",
	size = 26,
	color = "#000000",
	onPress = () => {},
	style = {},
	label = "",
	labelColor = "#A2A2A2",
	labelSize = 11,
	pressable = true,
}) => {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				{ ...style },
				pressed && pressable && styles.pressed,
			]}
			onPress={onPress}
		>
			<Ionicons name={icon} size={size} color={color} />
			{!!label && (
				<Text
					style={{ fontWeight: "200", color: labelColor, fontSize: labelSize }}
				>
					{label}
				</Text>
			)}
		</Pressable>
	);
};

export default IconButton;

const styles = StyleSheet.create({
	button: {
		padding: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	pressed: {
		opacity: 0.6,
	},
});

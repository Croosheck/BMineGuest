import { Pressable, StyleSheet, Text } from "react-native";

const HeaderRightButton = ({
	onPress,
	title,
	style,
	backgroundColor,
	titleColor,
}) => {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.summaryButtonContainer,
				pressed && { opacity: 0.7 },
				style,
				backgroundColor && { backgroundColor: backgroundColor },
			]}
			onPress={onPress}
		>
			<Text
				style={[styles.summaryButtonTitle, titleColor && { color: titleColor }]}
			>
				{title}
			</Text>
		</Pressable>
	);
};

export default HeaderRightButton;

const styles = StyleSheet.create({
	summaryButtonContainer: {
		color: "#ffffff",
		marginRight: 8,
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "#9A999496",
		borderRadius: 5,
	},
	summaryButtonTitle: {
		color: "#ffffff",
		fontSize: 15,
		fontWeight: "500",
		textShadowColor: "#ffffff",
		textShadowRadius: 4,
	},
});

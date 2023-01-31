import { Pressable, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

const VERTICAL_MARGIN = 4;

const ReservationDrawerButton = ({
	title,
	isFirst,
	isLast,
	cornerRadius,
	animatedScale,
	onPress,
	textCenteringMargin,
}) => {
	const buttonTitleFontSize = title.length < 12 ? 15 : 13;

	return (
		<Animated.View style={[styles.buttonContainer, animatedScale]}>
			<Pressable
				style={({ pressed }) => [
					styles.button,
					pressed && styles.buttonPressed,
					isFirst && {
						borderTopRightRadius: cornerRadius,
						marginTop: -VERTICAL_MARGIN,
					},
					isLast && {
						borderBottomRightRadius: cornerRadius,
						marginBottom: -VERTICAL_MARGIN,
					},
				]}
				onPress={onPress}
			>
				<Text
					style={[
						styles.buttonTitle,
						{ marginLeft: textCenteringMargin, fontSize: buttonTitleFontSize },
					]}
				>
					{title}
				</Text>
			</Pressable>
		</Animated.View>
	);
};

export default ReservationDrawerButton;

const styles = StyleSheet.create({
	buttonContainer: {
		flexGrow: 1,
		marginVertical: VERTICAL_MARGIN,
	},
	button: {
		flex: 1,
		backgroundColor: "#FFFFFF18",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonPressed: {
		opacity: 0.85,
		backgroundColor: "#FFFFFF2A",
	},
	buttonTitle: {
		textTransform: "uppercase",
		fontWeight: "700",
		color: "#ffffff",
		paddingHorizontal: 8,
		textAlign: "center",
		textShadowColor: "#000000",
		textShadowOffset: { height: 2, width: 2 },
		textShadowRadius: 5,
	},
});

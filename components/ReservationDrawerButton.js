import { Pressable, StyleSheet, Text, View } from "react-native";
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
				<Text style={[styles.buttonTitle, { marginLeft: textCenteringMargin }]}>
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
		marginRight: 3,
	},
	button: {
		flex: 1,
		backgroundColor: "#18CBF3",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonPressed: {
		opacity: 0.8,
	},
	buttonTitle: {
		textTransform: "uppercase",
		fontWeight: "700",
	},
});

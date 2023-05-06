import { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSpring,
} from "react-native-reanimated";
import IconButton from "../../../components/IconButton";

const CalendarButton = ({
	isAnimating = Boolean(),
	label = "",
	iconLabel = "",
	iconName = "",
	onIconPress = () => {},
}) => {
	const animatedCalendarIcon = useSharedValue(0.9);
	const reanimatedCalendarIconStyle = useAnimatedStyle(() => ({
		transform: [{ scale: animatedCalendarIcon.value }],
	}));

	useEffect(() => {
		if (!isAnimating) animatedCalendarIcon.value = 1;

		if (isAnimating) {
			animatedCalendarIcon.value = withRepeat(
				withSpring(1.1, { mass: 1, stiffness: 40 }),
				-1,
				true
			);
		}
	}, [isAnimating]);

	return (
		<View style={styles.calendarContainer}>
			<View style={styles.showCalendarLabelContainer}>
				<Text style={styles.showCalendarLabel}>{label}</Text>
			</View>
			<Animated.View
				style={[styles.showCalendarButton, reanimatedCalendarIconStyle]}
			>
				<IconButton
					icon={iconName}
					onPress={onIconPress}
					color="#FFFFFF"
					size={40}
					label={iconLabel}
				/>
			</Animated.View>
		</View>
	);
};

export default memo(CalendarButton);

const styles = StyleSheet.create({
	calendarContainer: {
		flexDirection: "row",
		width: "100%",
		gap: -50,
	},
	showCalendarLabelContainer: {
		flex: 0.5,
		justifyContent: "center",
		alignItems: "center",
	},
	showCalendarLabel: {
		color: "#ffffff",
		fontSize: 16,
	},
	showCalendarButton: {
		flex: 0.5,
	},
});

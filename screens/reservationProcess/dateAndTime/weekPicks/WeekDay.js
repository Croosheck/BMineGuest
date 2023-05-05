import { StyleSheet, Text, Pressable } from "react-native";

const WeekDay = ({
	day = {
		dayData: {},
		dayNum: Number(),
		monthNum: Number(),
		dayShort: "",
	},
	onPress = (day = {}) => {},
	currentDay = {
		timestamp: Number(),
		id: Number(),
	},
}) => {
	return (
		<Pressable
			onPress={onPress.bind(this, day)}
			style={[
				styles.container,
				currentDay.id === day.dayData.day && styles.dayActive,
				!day.dayData.isOpen && styles.dayUnavailable,
			]}
		>
			<Text style={styles.dayNameLabel}>{day.dayShort}</Text>
			<Text style={styles.dayDateLabel}>
				{day.dayNum}.{day.monthNum}
			</Text>
		</Pressable>
	);
};

export default WeekDay;

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#FFFFFF0A",
		flexBasis: 30,
		paddingVertical: 10,
		borderRadius: 15,
	},
	dayActive: {
		backgroundColor: "#FFFFFF3E",
	},
	dayUnavailable: {
		backgroundColor: "transparent",
		transform: [{ scale: 0.9 }],
		opacity: 0.4,
	},
	dayNameLabel: {
		color: "#ffffff",
		textTransform: "capitalize",
		width: "100%",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "500",
	},
	dayDateLabel: {
		color: "#C5C5C5",
		textTransform: "capitalize",
		width: "100%",
		textAlign: "center",
		fontSize: 12,
		fontWeight: "200",
	},
});

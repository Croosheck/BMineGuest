import { StyleSheet, Text, View } from "react-native";

const WeekSchedule = ({ openDays = [], label = "" }) => {
	return (
		<View style={styles.openDays}>
			<Text style={styles.openDaysLabel}>{label}</Text>
			{openDays.map((day, i) => {
				const capitalizeDay =
					day.dayLong.slice(0, 1).toUpperCase() + day.dayLong.slice(1);
				const reservationsOpenHour = String(
					day.hours.reservationsOpen
				).padStart(2, 0);
				const reservationsCloseHour = String(
					day.hours.reservationsClose
				).padStart(2, 0);

				return (
					<View style={styles.openDayContainer} key={i}>
						<Text style={[styles.openDay]}>{capitalizeDay}: </Text>
						<Text style={[styles.openDay, !day.isOpen && styles.closedDay]}>
							{`${
								day.isOpen
									? reservationsOpenHour + " - " + reservationsCloseHour
									: "Unavailable"
							}`}
						</Text>
					</View>
				);
			})}
		</View>
	);
};

export default WeekSchedule;

const styles = StyleSheet.create({
	openDays: {
		width: "50%",
		maxWidth: 220,
		minWidth: 220,
	},
	openDaysLabel: {
		color: "#A1A1A1",
		fontWeight: "200",
		marginBottom: 5,
		textDecorationLine: "underline",
		fontSize: 13,
		letterSpacing: 1,
	},
	openDayContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	openDay: {
		color: "#ffffff",
		fontSize: 18,
		textShadowRadius: 10,
		textShadowColor: "#ffffff",

		//to avoid shadow property being cut
		borderRightWidth: 2,
		borderLeftWidth: 2,
		borderColor: "transparent",
	},
	closedDay: {
		textShadowRadius: null,
		textShadowColor: null,
		opacity: 0.3,
		textAlign: "center",
		fontSize: 15,
	},
});

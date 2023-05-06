import { StyleSheet, View } from "react-native";
import { getOneWeek } from "./utils";
import WeekDay from "./weekPicks/WeekDay";
import { memo } from "react";

const WeekPicks = ({
	openDaysData = [],
	onDayPress = () => {},
	currentDay = {
		timestamp: Number(),
		id: Number(),
	},
	closestTimestamp,
}) => {
	return (
		<View style={styles.container}>
			{getOneWeek(openDaysData, closestTimestamp).map((d) => (
				<WeekDay
					day={d}
					onPress={onDayPress}
					currentDay={currentDay}
					key={d.dayData.dayLong}
				/>
			))}
		</View>
	);
};

export default memo(WeekPicks);

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		justifyContent: "center",
	},
});

import { StyleSheet, View } from "react-native";
import Stat from "./Stat";

const Stats = ({ upcoming = Number(), total = Number(), WIDTH = Number() }) => {
	return (
		<View style={[styles.statsContainer, { width: WIDTH }]}>
			<Stat data={upcoming} label="Upcoming Reservations" />

			<Stat data={total} label="Ever Submitted" />
		</View>
	);
};

export default Stats;

const styles = StyleSheet.create({
	statsContainer: {
		flexDirection: "row",
		transform: [{ translateY: 20 }],
		paddingVertical: 10,
		flexWrap: "wrap",
	},
});

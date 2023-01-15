import { Button, StyleSheet, View } from "react-native";

const ReservationsFilters = ({ left, middle, right }) => {
	return (
		<View style={styles.filtersContainer}>
			<View style={styles.filterContainer}>
				<Button title={left.title} onPress={left.onPress} />
			</View>
			<View style={styles.filterContainer}>
				<Button title={middle.title} onPress={middle.onPress} />
			</View>
			<View style={styles.filterContainer}>
				<Button title={right.title} onPress={right.onPress} />
			</View>
		</View>
	);
};

export default ReservationsFilters;

const styles = StyleSheet.create({
	filtersContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	filterContainer: {
		minWidth: "33.333%",
	},
});

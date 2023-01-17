import { Button, StyleSheet, View } from "react-native";
import FilterButton from "./FilterButton";

const ReservationsFilters = ({ left, middle, right }) => {
	return (
		<View style={styles.filtersContainer}>
			<FilterButton
				title={left.title}
				onPress={left.onPress}
				style={[styles.button, left.active && styles.filterActive]}
				disPressAnim
				titleStyle={styles.filterTitle}
			/>
			<FilterButton
				title={middle.title}
				onPress={middle.onPress}
				style={[styles.button, middle.active && styles.filterActive]}
				disPressAnim
				titleStyle={styles.filterTitle}
			/>
			<FilterButton
				title={right.title}
				onPress={right.onPress}
				style={[styles.button, right.active && styles.filterActive]}
				disPressAnim
				titleStyle={styles.filterTitle}
			/>
		</View>
	);
};

export default ReservationsFilters;

const styles = StyleSheet.create({
	filtersContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginVertical: 15,
	},
	button: {
		backgroundColor: "#423051",
		paddingVertical: 7,
		marginHorizontal: 10,
	},
	filterActive: {
		backgroundColor: "#776C81",
	},
	filterTitle: {
		width: "100%",
		textShadowColor: "#000000",
		textShadowRadius: 10,
	},
});

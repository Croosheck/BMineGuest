import { Button, Dimensions, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
	addReservationItem,
	removeReservationItem,
} from "../../redux/slices/user";

const Table = () => {
	const dispatch = useDispatch();

	function addDataHandler() {
		dispatch(addReservationItem({ table: "table" }));
	}
	function removeDataHandler() {
		dispatch(removeReservationItem({ table: "" }));
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Table</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<View style={{ width: "40%" }}>
					<Button title="Add" onPress={addDataHandler} />
				</View>
				<View style={{ width: "40%" }}>
					<Button title="Remove" onPress={removeDataHandler} />
				</View>
			</View>
		</View>
	);
};

export default Table;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
		padding: 8,
	},
	text: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
	},
});

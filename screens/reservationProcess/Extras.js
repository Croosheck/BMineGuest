import { Button, Dimensions, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
	addReservationItem,
	removeReservationItem,
} from "../../redux/slices/user";

const Extras = () => {
	const dispatch = useDispatch();

	function addDataHandler() {
		dispatch(addReservationItem({ extras: "extras" }));
	}
	function removeDataHandler() {
		dispatch(removeReservationItem({ extras: "" }));
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Extras</Text>
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

export default Extras;

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

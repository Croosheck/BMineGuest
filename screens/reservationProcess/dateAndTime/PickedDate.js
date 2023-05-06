import { memo } from "react";
import { StyleSheet, Text } from "react-native";

const PickedDate = ({
	label = "",
	data = {
		date: "",
		weekDay: "",
	},
}) => {
	return (
		<>
			<Text style={styles.pickedDate}>
				{data.date && `${data.date} (${data.weekDay})`}
			</Text>
			<Text style={styles.label}>{data.date && label}</Text>
		</>
	);
};

export default memo(PickedDate);

const styles = StyleSheet.create({
	pickedDate: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
	},
	label: {
		color: "#ACACAC",
		fontSize: 13,
		fontWeight: "200",
	},
});

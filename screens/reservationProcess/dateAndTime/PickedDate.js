import { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { normalizeFontSize } from "../../../util/normalizeFontSize";

const PickedDate = ({
	label = "",
	data = {
		date: "",
		weekDay: "",
	},
}) => {
	return (
		<>
			<Text
				style={[
					styles.pickedDate,
					{
						fontSize: normalizeFontSize(20),
					},
				]}
			>
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
		textAlign: "center",
	},
	label: {
		color: "#ACACAC",
		fontSize: 13,
		fontWeight: "200",
	},
});

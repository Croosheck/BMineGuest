import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SectionDivider = ({ percentageWidth = "90%", margin = 10 }) => {
	return (
		<View
			style={[
				styles.divider,
				{ width: percentageWidth, marginVertical: margin },
			]}
		></View>
	);
};

export default SectionDivider;

const styles = StyleSheet.create({
	divider: {
		borderTopWidth: 0.5,
		borderColor: "#9F9F9F",
	},
});

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Example from "./timeExamples/Example";
import { getExampleClosestHours } from "./utils";
import { memo } from "react";

const TimeExamples = ({
	initialTimestamp = Number(),
	maxQuantity = 3,
	jump = 1,
	onExamplePress = () => {},
	openDays = [],
	isDatePicked = false,
}) => {
	const [isActive, setIsActive] = useState();

	function onExamplePressHandler(timestamp, time) {
		onExamplePress(timestamp);
		setIsActive(time);
	}

	return (
		<View style={styles.container}>
			{getExampleClosestHours(openDays, {
				initialTimestamp: initialTimestamp,
				maxQuantity: maxQuantity,
				jump: jump,
			}).map((example) => (
				<Example
					key={example.timestamp}
					title={example.formattedTime}
					active={isDatePicked && isActive === example.formattedTime}
					onPress={() =>
						onExamplePressHandler(example.timestamp, example.formattedTime)
					}
				/>
			))}
		</View>
	);
};

export default memo(TimeExamples);

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap",
		gap: 10,
		paddingHorizontal: 15,
	},
});

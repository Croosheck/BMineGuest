import { StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../../util/normalizeFontSize";

const ExtrasSection = ({ extrasPrice = Number(), extras = [] }) => {
	let content = "";

	function getBoldText(content) {
		return (
			<Text
				style={[
					styles.content,
					{ fontSize: normalizeFontSize(14) },
					styles.contentHighlighted,
				]}
			>
				{content}
			</Text>
		);
	}

	if (extrasPrice > 0) {
		content = (
			<>
				<Text
					style={[styles.content, { fontSize: normalizeFontSize(14) }]}
				>{`The total price for your extra services (${extras.length}) is:`}</Text>
				{getBoldText(`${extrasPrice}$`)}
				<Text style={styles.annotation}>
					The amount will be payable during the visit.
				</Text>
			</>
		);
	}
	if (extrasPrice === 0 && extras.length > 0) {
		content = (
			<>
				<Text
					style={[styles.content, { fontSize: normalizeFontSize(14) }]}
				>{`The extra services (${extras.length}) you picked are FREE!`}</Text>
			</>
		);
	}
	if (extrasPrice === 0 && extras.length === 0) {
		content = (
			<Text
				style={[styles.content, { fontSize: normalizeFontSize(14) }]}
			>{`You didn't pick any extra services.`}</Text>
		);
	}

	return <View style={styles.container}>{content}</View>;
};

export default ExtrasSection;

const styles = StyleSheet.create({
	container: {},
	content: {
		textAlign: "center",
		lineHeight: 22,
	},
	contentHighlighted: {
		fontWeight: "bold",
		fontSize: 17,
	},
	annotation: {
		fontSize: 11,
		textAlign: "center",
		margin: 5,
	},
});

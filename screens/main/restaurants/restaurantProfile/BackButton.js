import { StyleSheet } from "react-native";
import IconButton from "../../../../components/IconButton";

const BackButton = ({ onPress = () => {} }) => {
	return (
		<IconButton
			style={styles.container}
			icon="arrow-back"
			color="#ffffff"
			size={32}
			onPress={onPress}
		/>
	);
};

export default BackButton;

const styles = StyleSheet.create({
	container: {
		padding: 0,
		position: "absolute",
		top: 20,
		left: 20,
		borderRadius: 99,
		minWidth: 40,
		minHeight: 40,
		backgroundColor: "#00000050",
	},
});

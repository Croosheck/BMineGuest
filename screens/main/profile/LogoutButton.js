import { StyleSheet } from "react-native";
import IconButton from "../../../components/IconButton";

const LogoutButton = ({ onPress = () => {} }) => {
	return (
		<IconButton
			style={styles.button}
			onPress={onPress}
			icon="md-exit-outline"
			color="#ffffff"
			size={36}
			label="Logout"
			labelSize={10}
			labelColor="#ffffff"
			labelStyle={{
				transform: [{ translateX: -3 }, { translateY: -4 }],
				textTransform: "uppercase",
				fontWeight: "300",
			}}
		/>
	);
};

export default LogoutButton;

const styles = StyleSheet.create({
	button: {
		position: "absolute",
		top: 0,
		right: 0,
		padding: 0,
		marginRight: 20,
		marginTop: 20,
	},
});

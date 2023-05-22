import { StyleSheet, Text } from "react-native";
import { normalizeFontSize } from "../../../util/normalizeFontSize";

const UserName = ({ name = "", WIDTH = Number() }) => {
	return (
		<Text
			style={[
				styles.userName,
				{ fontSize: normalizeFontSize(22), width: WIDTH },
			]}
		>
			{name}
		</Text>
	);
};

export default UserName;

const styles = StyleSheet.create({
	userName: {
		color: "#FFFFFF",
		fontWeight: "bold",
		textShadowColor: "#000000",
		textShadowOffset: { height: 2, width: 2 },
		textShadowRadius: 8,
		textAlign: "center",
	},
});

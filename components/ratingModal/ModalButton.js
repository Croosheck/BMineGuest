import { Pressable, StyleSheet, Text } from "react-native";

const ModalButton = ({ onPress, title }) => {
	return (
		<Pressable
			style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}
			onPress={onPress}
		>
			<Text style={styles.modalButtonTitle}>{title}</Text>
		</Pressable>
	);
};

export default ModalButton;

const styles = StyleSheet.create({
	modalButton: {
		minWidth: 100,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 5,
		paddingVertical: 10,
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		elevation: 4,
		shadowColor: "#000000",
		//ios
		shadowOffset: { height: 2, width: 0 },
		shadowRadius: 4,
		shadowOpacity: 1,
	},
	modalButtonTitle: {
		color: "#000000",
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
	},
	pressed: {
		opacity: 0.8,
	},
});

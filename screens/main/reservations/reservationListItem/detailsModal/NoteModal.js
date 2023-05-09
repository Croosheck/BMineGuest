import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../../util/normalizeFontSize";

const NoteModal = ({
	isVisible = Boolean(),
	content = "",
	onRequestClose = () => {},
}) => {
	return (
		<Modal
			visible={isVisible}
			animationType="fade"
			transparent={true}
			hardwareAccelerated
			onRequestClose={onRequestClose}
			statusBarTranslucent={true}
		>
			<Pressable style={styles.noteBackdrop} onPress={onRequestClose}>
				<View
					style={styles.noteModal}
					onStartShouldSetResponder={(event) => true}
					onTouchEnd={(e) => {
						e.stopPropagation();
					}}
				>
					<View style={styles.noteLabelBox}>
						<Text
							style={[styles.noteLabel, { fontSize: normalizeFontSize(18) }]}
						>
							This is the additional message you provided during the
							reservation:
						</Text>
					</View>
					<View style={styles.noteContentBox}>
						<Text
							style={[styles.noteContent, { fontSize: normalizeFontSize(15) }]}
						>
							{content}
						</Text>
					</View>
				</View>
			</Pressable>
		</Modal>
	);
};

export default NoteModal;

const styles = StyleSheet.create({
	noteBackdrop: {
		flex: 1,
		backgroundColor: "#0000009E",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	noteModal: {
		minHeight: "30%",
		width: "80%",
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		overflow: "hidden",
		padding: 10,
		gap: 10,
	},
	noteLabelBox: {
		flex: 0.3,
		width: "100%",
		alignItems: "center",
	},
	noteLabel: {
		textAlign: "center",
		fontWeight: "500",
		color: "#666666",
	},
	noteContentBox: {
		flex: 0.7,
		width: "100%",
		alignItems: "center",
	},
	noteContent: {
		textAlign: "center",
	},
});

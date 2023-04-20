import { StyleSheet, View } from "react-native";
import OutlinedButton from "../../../components/OutlinedButton";

const Buttons = ({
	screenWidth = 500,
	howManyHandler = () => {},
	howMany = 0,
	onReserveHandler = () => {},
	visible = Boolean(),
}) => {
	return (
		<>
			{visible && (
				<View style={styles.buttonsContainer}>
					<View
						style={[
							styles.setButtonContainer,
							{ width: screenWidth * 0.1, height: screenWidth * 0.1 },
						]}
					>
						<OutlinedButton
							title="-"
							onPress={howManyHandler.bind(this, "decrement")}
							style={styles.setButton}
							titleStyle={styles.setButtonTitle}
						/>
					</View>
					<View
						style={[
							styles.submitButtonContainer,
							{ minWidth: screenWidth * 0.4, height: screenWidth * 0.1 },
						]}
					>
						<OutlinedButton
							title={`Reservation for ${howMany}`}
							onPress={onReserveHandler}
							titleStyle={{ textShadowColor: "white", textShadowRadius: 6 }}
							innerStyle={styles.submitButton}
						/>
					</View>
					<View
						style={[
							styles.setButtonContainer,
							{ width: screenWidth * 0.1, height: screenWidth * 0.1 },
						]}
					>
						<OutlinedButton
							title="+"
							onPress={howManyHandler.bind(this, "increment")}
							style={styles.setButton}
							titleStyle={styles.setButtonTitle}
						/>
					</View>
				</View>
			)}
		</>
	);
};

export default Buttons;

const styles = StyleSheet.create({
	buttonsContainer: {
		flex: 0.15,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: "auto",
		marginBottom: "auto",
	},
	submitButtonContainer: {
		marginHorizontal: 10,
	},
	submitButton: {
		height: "100%",
		justifyContent: "center",
	},
	setButtonContainer: {},
	setButton: {
		borderWidth: 1,
	},
	setButtonTitle: {
		fontSize: 28,
		fontWeight: "normal",
		textShadowColor: "white",
		textShadowRadius: 6,
	},
});

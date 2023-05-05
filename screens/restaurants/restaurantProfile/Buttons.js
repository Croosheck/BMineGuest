import { StyleSheet, View } from "react-native";
import OutlinedButton from "../../../components/OutlinedButton";
import IconButton from "../../../components/IconButton";

const Buttons = ({
	screenWidth = 500,
	howManyHandler = () => {},
	howMany = 0,
	onReserveHandler = () => {},
	visible = Boolean(),
	sideButtonsSize = 30,
}) => {
	return (
		<>
			{visible && (
				<View style={styles.buttonsContainer}>
					<IconButton
						icon="person-remove"
						color="#ffffff"
						onPress={howManyHandler.bind(this, "decrement")}
						size={sideButtonsSize}
					/>

					<View
						style={[
							styles.submitButtonContainer,
							{ minWidth: screenWidth * 0.45, height: screenWidth * 0.1 },
						]}
					>
						<OutlinedButton
							title={`Reservation for ${howMany}`}
							onPress={onReserveHandler}
							titleStyle={{ textShadowColor: "white", textShadowRadius: 6 }}
							innerStyle={styles.submitButton}
						/>
					</View>

					<IconButton
						icon="person-add"
						color="#ffffff"
						onPress={howManyHandler.bind(this, "increment")}
						size={sideButtonsSize}
					/>
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
	setButtonTitle: {
		fontSize: 28,
		fontWeight: "normal",
		textShadowColor: "white",
		textShadowRadius: 6,
	},
});

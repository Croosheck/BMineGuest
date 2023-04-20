import { StyleSheet, TextInput, View } from "react-native";
import IconButton from "../IconButton";

const SignLogInput = ({
	placeholder = "",
	onChangeText = () => {},
	value = "",
	style = {},
	textContentType = "none",
	isPasswordHidden = false,
	icon = "",
	iconColor = "#000000",
	iconSize = 22,
	onIconPress = () => {},
}) => {
	return (
		<View style={styles.inputContainer}>
			<TextInput
				placeholder={placeholder}
				onChangeText={onChangeText}
				value={value}
				style={[styles.input, style]}
				textContentType={textContentType}
				secureTextEntry={isPasswordHidden}
			/>
			{!!icon && (
				<IconButton
					icon={icon}
					color={iconColor}
					size={iconSize}
					onPress={onIconPress}
				/>
			)}
		</View>
	);
};

export default SignLogInput;

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: 10,
		marginVertical: 8,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		height: 40,
		width: "100%",
		elevation: 6,
		shadowColor: "#00000085",
		shadowRadius: 10,
		shadowOffset: { height: 2, width: 2 },
	},
	input: {
		flex: 1,
		color: "#000000",
		fontSize: 16,
	},
});

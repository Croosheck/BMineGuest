import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Icon = ({ name, color, size }) => {
	return (
		<View>
			<MaterialCommunityIcons name={name} size={size} color={color} />
		</View>
	);
};

export default Icon;

const styles = StyleSheet.create({});

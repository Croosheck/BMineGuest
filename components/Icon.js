import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Icon = ({ name, color, size }) => {
	return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

export default Icon;

const styles = StyleSheet.create({});

import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { normalizeFontSize } from "../util/normalizeFontSize";
import { LinearGradient } from "expo-linear-gradient";

const LoadingSplashScreen = ({ theme = "dark", label = "", style = {} }) => {
	function useTheme(mode = "") {
		if (mode === "dark") return ["#ffffff", ["#3B1616", "#010C1C", "#370B0B"]];
		if (mode === "light") return ["#000000", ["#6C6B6B", "#CBE0FF", "#FFCDCD"]];
	}

	const [fontClr, bgClr] = useTheme(theme);

	return (
		<LinearGradient style={[styles.container, style]} colors={bgClr}>
			<ActivityIndicator color={fontClr} size="large" />
			<Text
				style={[
					styles.label,
					{ fontSize: normalizeFontSize(16), color: fontClr },
				]}
			>
				{label}
			</Text>
		</LinearGradient>
	);
};

export default LoadingSplashScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 15,
	},
	label: {
		letterSpacing: 0.3,
	},
});

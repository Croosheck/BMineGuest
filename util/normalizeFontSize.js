import { PixelRatio } from "react-native";

export function normalizeFontSize(fontSize) {
	const normalizer = 1 / PixelRatio.getFontScale();
	return normalizer * fontSize;
}

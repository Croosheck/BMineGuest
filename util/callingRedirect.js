import { Linking } from "react-native";

export function callingRedirect({ phoneNumber: phoneNumber }) {
	Linking.openURL(`tel:${phoneNumber}`);
}

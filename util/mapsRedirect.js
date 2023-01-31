import { Linking, Platform } from "react-native";

// Shows on Google Maps
export function mapsRedirect({
	url: url,
	pinpointName: pinpointName,
	lat: lat,
	lng: lng,
}) {
	const scheme = Platform.select({
		ios: "maps:0,0?q=",
		android: "geo:0,0?q=",
	});
	const latLng = `${lat},${lng}`;
	const label = pinpointName;
	// const url = Platform.select({
	// 	ios: `${scheme}${label}@${latLng}`,
	// 	android: `${scheme}${latLng}(${label})`,
	// });

	Linking.openURL(url);
}

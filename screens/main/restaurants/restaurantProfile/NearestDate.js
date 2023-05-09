import {
	Dimensions,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { formatDate } from "../../../../util/formatDate";
import { closestDateReservation } from "../../../../util/closestDateReservation";
import { normalizeFontSize } from "../../../../util/normalizeFontSize";

const { width: WIDTH } = Dimensions.get("window");

const NearestDate = ({
	reservationAdvance = Number(),
	reservationsEnabled = Boolean(),
	openDays = [
		{
			day: Number(),
			dayLong: "",
			hours: {
				reservationsClose: Number(),
				reservationsOpen: Number(),
			},
			isOpen: Boolean(),
		},
	],
}) => {
	const closestReservationTimestamp = closestDateReservation({
		reservationAdvance,
		reservationsEnabled,
		openDays,
	});

	const isAnyOpen = openDays.some((day) => day.isOpen);

	return closestReservationTimestamp && reservationsEnabled && isAnyOpen ? (
		<ImageBackground
			style={styles.closestDateContainer}
			imageStyle={styles.closestDatePlateImage}
			source={require("../../../../assets/restaurantProfile/plate1.png")}
		>
			<View style={styles.closestDateInnerContainer}>
				<Text style={styles.closestDate}>{`Nearest\navail. date:`}</Text>
				<Text
					style={[
						styles.closestDate,
						styles.dateStyle,
						{ fontSize: normalizeFontSize(17) },
					]}
				>
					{formatDate(closestReservationTimestamp, "onlyDate")}
				</Text>
			</View>
		</ImageBackground>
	) : (
		<ImageBackground
			style={styles.closestDateContainer}
			imageStyle={styles.closestDatePlateImage}
			source={require("../../../../assets/restaurantProfile/plate1.png")}
		>
			<View style={styles.closestDateInnerContainer}>
				<Text
					numberOfLines={3}
					style={[
						styles.closestDate,
						styles.dateStyle,
						{
							top: "9%",
							fontSize: normalizeFontSize(WIDTH * 0.04),
							textShadowRadius: 3,
						},
					]}
				>
					Reservations currently disabled.
				</Text>
			</View>
		</ImageBackground>
	);
};

export default NearestDate;

const styles = StyleSheet.create({
	closestDateContainer: {
		width: WIDTH * 0.33,
		height: WIDTH * 0.33,
		position: "absolute",
		right: 0,
		top: -WIDTH * 0.27,
		zIndex: 2,
		marginRight: WIDTH * 0.01,
		borderRadius: WIDTH * 0.33 * 0.5,
	},
	closestDatePlateImage: {
		// borderWidth: 2,
		borderColor: "#FFFFFF",
		borderRadius: WIDTH * 0.33 * 0.5,
	},
	closestDateInnerContainer: {
		position: "absolute",
		top: "20%",
		left: 0,
		right: 0,
	},
	closestDate: {
		textAlign: "center",
		color: "#ffffff",
		fontWeight: "500",
		textShadowColor: "white",
		textShadowRadius: 6,
	},
	dateStyle: {
		fontWeight: "900",
		color: "#00FFAE",
		// color: "#57851A",
		marginTop: 5,
		top: -5,
	},
});

import { StyleSheet, Text, View } from "react-native";
import { formatDate } from "../../../../util/formatDate";

const WIDTH = "90%";
const MS_PER_DAY = 86400000;
const MS_PER_HOUR = 3600000;
const MS_PER_MINUTE = 60000;

const TimelineBarSection = ({
	madeOnTimestamp = Number(),
	reservationDateTimestamp = Number(),
	reservationDate = String(),
}) => {
	const currentTimestamp = Date.now();
	let timeLeft = "";

	//testing values
	// const timeTotal = MS_PER_DAY * 3;
	// const timePassed = MS_PER_DAY * 2 + MS_PER_HOUR * 13 + MS_PER_MINUTE * 25;
	// const timeDelta = timeTotal - timePassed;

	const timeTotal = reservationDateTimestamp - madeOnTimestamp;
	const timePassed = currentTimestamp - madeOnTimestamp;
	const timeDelta = reservationDateTimestamp - currentTimestamp;

	const daysLeft = Math.floor(timeDelta / MS_PER_DAY);
	const hoursLeft = Math.floor((timeDelta % MS_PER_DAY) / MS_PER_HOUR);
	const minutesLeft = Math.floor((timeDelta % MS_PER_HOUR) / MS_PER_MINUTE);

	if (daysLeft >= 1) {
		timeLeft = `${daysLeft} day(s)${
			hoursLeft !== 0 ? ` and ${hoursLeft} hour(s) left.` : "."
		}`;
	}

	if (daysLeft === 0) {
		if (hoursLeft > 0) {
			timeLeft = `${hoursLeft} hour(s)${
				minutesLeft !== 0 ? ` and ${minutesLeft} minute(s) left.` : "."
			}`;
		}

		if (hoursLeft === 0) {
			timeLeft = `${minutesLeft} minute(s) left.`;
		}
	}

	const progress = (timePassed / MS_PER_HOUR / (timeTotal / MS_PER_HOUR)) * 100;
	const result = progress > 100 ? 100 : progress;

	const progressPercentage = result.toFixed(0);

	const formattedStart = formatDate(madeOnTimestamp);

	return (
		<View style={styles.container}>
			<View style={styles.labelsBox}>
				<View style={styles.labelBox}>
					<Text style={styles.label}>Made On</Text>
					<Text style={styles.date}>{formattedStart}</Text>
				</View>
				<View style={styles.labelBox}>
					<Text style={styles.label}>For (local)</Text>
					<Text style={styles.date}>{reservationDate}</Text>
				</View>
			</View>
			<View style={styles.progressBar}>
				{timeDelta > 0 && (
					<Text style={styles.progressTimeLeft}>{timeLeft}</Text>
				)}
				<View
					style={[styles.progress, { width: `${progressPercentage}%` }]}
				></View>
			</View>
		</View>
	);
};

export default TimelineBarSection;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignItems: "center",
	},
	//////////////////////
	labelsBox: {
		width: WIDTH,
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	labelBox: {
		gap: 5,
	},
	label: {
		textTransform: "uppercase",
		fontWeight: "600",
		color: "#656565",
		letterSpacing: 0.7,
		fontSize: 12,
	},
	date: {
		fontWeight: "500",
		fontSize: 13,
	},
	//////////////////////
	progressBar: {
		width: WIDTH,
		height: 20,
		borderWidth: 1,
		borderColor: "#ADADAD",
		borderRadius: 10,
		overflow: "hidden",
		position: "relative",
		justifyContent: "center",
	},
	progress: {
		flex: 1,
		backgroundColor: "#9FCBFB",
	},
	progressTimeLeft: {
		position: "absolute",
		zIndex: 3,
		width: "100%",
		textAlign: "center",
		fontSize: 13,
	},
});

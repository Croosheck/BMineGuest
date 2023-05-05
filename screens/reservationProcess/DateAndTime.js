import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useDispatch, useSelector } from "react-redux";
import {
	clearDate,
	pickDate,
	pickDateParameters,
} from "../../redux/slices/user";

import { formatDate } from "../../util/formatDate";
import { closestDateReservation } from "../../util/closestDateReservation";
import { getDateParams, sortByDay } from "./dateAndTime/utils";
import Calendar from "../../components/Calendar";
import TimeExamples from "./dateAndTime/TimeExamples";
import WeekPicks from "./dateAndTime/WeekPicks";
import WeekSchedule from "./dateAndTime/WeekSchedule";
import PickedDate from "./dateAndTime/PickedDate";
import CalendarButton from "./dateAndTime/CalendarButton";

const DateAndTime = ({ route }) => {
	const [displayTime, setDisplayTime] = useState({
		date: "",
		weekDay: "",
	});
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

	const { reservationDate } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	const { reservationAdvance, openDays, reservationsEnabled } = route.params;

	const animatedDateOpacity = useSharedValue(0);
	const reanimatedDateOpacityStyle = useAnimatedStyle(() => ({
		opacity: animatedDateOpacity.value,
	}));

	const closestReservationTimestamp = closestDateReservation({
		reservationAdvance,
		reservationsEnabled,
		openDays,
	});

	const [currentDay, setCurrentDay] = useState({
		timestamp: closestReservationTimestamp,
		id: new Date(closestReservationTimestamp).getDay(),
	});

	useEffect(() => {
		if (reservationDate) {
			const dayLong = openDays.find(
				(day) => new Date(reservationDate).getDay() === day.day
			).dayLong;

			setDisplayTime({
				date: formatDate(reservationDate),
				weekDay: dayLong.charAt(0).toUpperCase() + dayLong.slice(1),
			});
			animatedDateOpacity.value = withTiming(1, { duration: 500 });
		}
	}, [reservationDate]);

	function showCalendarHandler() {
		setIsDatePickerVisible(true);
	}

	function clearDateHandler() {
		setDisplayTime({
			date: "",
			weekDay: "",
		});
	}

	function animateDateHandler() {
		dispatch(clearDate());
		animatedDateOpacity.value = withTiming(0, {}, () => {
			runOnJS(clearDateHandler)();
		});
	}

	function quickChoiceDayHandler(d) {
		if (!d.dayData.isOpen) return;

		animateDateHandler();

		setCurrentDay({
			timestamp: d.openingTimestamp,
			id: d.dayData.day,
		});
	}

	function pickExampleDate({ timestamp = Number() }) {
		const dateParams = getDateParams(timestamp);

		dispatch(pickDate(timestamp));
		dispatch(pickDateParameters(dateParams));
	}

	//sorts the openDays array, so the openDays.day property (which has been created by .getDay() method) matches the index
	const openDaysSorted = sortByDay(openDays);

	return (
		<LinearGradient style={styles.container} colors={["#000A2B", "#545351"]}>
			<View style={styles.quickChoiceContainer}>
				<WeekPicks
					openDaysData={openDaysSorted}
					onDayPress={quickChoiceDayHandler}
					currentDay={currentDay}
					closestTimestamp={closestReservationTimestamp}
				/>

				<TimeExamples
					initialTimestamp={currentDay.timestamp}
					maxQuantity={5}
					jump={1.5}
					openDays={openDays}
					isDatePicked={reservationDate}
					onExamplePress={(exampleTimestamp) =>
						pickExampleDate({
							timestamp: exampleTimestamp,
						})
					}
				/>
			</View>

			<WeekSchedule label="Available Days" openDays={openDays} />

			<Animated.View
				style={[styles.pickedReservation, reanimatedDateOpacityStyle]}
			>
				<PickedDate label="Picked Date" data={displayTime} />
			</Animated.View>

			<Calendar
				openDays={openDays}
				reservationAdvance={reservationAdvance}
				closestReservationTimestamp={closestReservationTimestamp}
				isDatePickerVisible={isDatePickerVisible}
				hideDatePicker={() => setIsDatePickerVisible(false)}
			/>

			<CalendarButton
				onIconPress={showCalendarHandler}
				isAnimating={!reservationDate}
				label="More distant plans?"
				iconName="calendar"
				iconLabel="Open Calendar"
			/>
		</LinearGradient>
	);
};

export default DateAndTime;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
		gap: 20,
		justifyContent: "space-around",
	},
	quickChoiceContainer: {
		gap: 20,
		marginHorizontal: 10,
		padding: 10,
		borderRadius: 15,
		backgroundColor: "#00000014",
	},
	pickedReservation: {
		alignItems: "center",
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#7979792D",
	},
});

export const closestDateReservation = ({
	reservationAdvance,
	reservationsEnabled,
	openDays,
}) => {
	const anyOpenDay = openDays.some((dayData) => dayData.isOpen);

	if (!anyOpenDay || !reservationsEnabled) {
		return false;
	}

	const MS_PER_MINUTE = 60000;
	const MS_PER_HOUR = 3600000;
	const MS_PER_DAY = 86400000;
	let daysUpMore = 1;

	// const advance = reservationAdvance * 0.5;

	const closestTimestamp = new Date().valueOf() + reservationAdvance;

	let pickedDay = openDays.find(
		(dayData) => dayData.day === new Date(closestTimestamp).getDay()
	);

	let findTimestamp = closestTimestamp;

	// Looks for the closest open day
	if (!pickedDay.isOpen) {
		while (!pickedDay.isOpen) {
			// console.log(pickedDay);
			findTimestamp = closestTimestamp + MS_PER_DAY * daysUpMore;
			pickedDay = openDays.find(
				(dayData) => dayData.day === new Date(findTimestamp).getDay()
			);
			daysUpMore += 1;
			// console.log(pickedDay);
		}
	}

	//Get minutes
	const closestTimestampMinutes = new Date(findTimestamp).getMinutes();

	//Cut minutes
	const closestTimestampWithCutMinutes =
		findTimestamp - closestTimestampMinutes * MS_PER_MINUTE;

	//Get hours
	const closestTimestampHours = new Date(
		closestTimestampWithCutMinutes
	).getHours();

	//Cut hours
	let closestTimestampWithCutHours =
		closestTimestampWithCutMinutes - closestTimestampHours * MS_PER_HOUR;

	//Add hours number equal to the reservations opening time
	const closestTimestampOnOpen =
		closestTimestampWithCutHours +
		pickedDay.hours.reservationsOpen * MS_PER_HOUR;

	return closestTimestampOnOpen;
};

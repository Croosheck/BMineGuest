import { formatDate } from "../../../util/formatDate";
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

export function getDateParams(timestamp = Number()) {
	const dateParams = {
		year: new Date(timestamp).getFullYear(),
		month: new Date(timestamp).getMonth(),
		day: new Date(timestamp).getDate(),
		hours: new Date(timestamp).getHours(),
		minutes: new Date(timestamp).getMinutes(),
		weekdayNumber: new Date(timestamp).getDay(),
	};

	return dateParams;
}

export function getExampleClosestHours(
	openDays = [],
	{ initialTimestamp = Number(), maxQuantity = 3, jump = 1 }
) {
	const MS_PER_HOUR = 3600000;

	const dateParams = getDateParams(initialTimestamp);

	const closestDayOpeningData = openDays.find(
		(dayData) => dayData.day === dateParams.weekdayNumber
	);

	const { reservationsOpen: open, reservationsClose: close } =
		closestDayOpeningData.hours;

	const timeOpened = close - open;
	const quantity = timeOpened >= maxQuantity ? maxQuantity : timeOpened + 1;

	const examples = [];

	for (let i = 0; i < quantity; i++) {
		if (i * jump > timeOpened) return examples;

		const exampleTimestamp = initialTimestamp + MS_PER_HOUR * jump * i;

		examples.push({
			timestamp: exampleTimestamp,
			formattedTime: formatDate(exampleTimestamp, "onlyTime"),
		});
	}

	return examples;
}

export function getOneWeek(schedule = [{}], closestTimestamp = Number()) {
	const week = [];

	for (let i = 0; i < 7; i++) {
		const dayTimestamp = closestTimestamp + MS_PER_DAY * i;

		const weekDayHours = new Date(dayTimestamp).getHours();
		const weekDayNum = new Date(dayTimestamp).getDay();
		const monthNum = String(new Date(dayTimestamp).getMonth() + 1).padStart(
			2,
			"0"
		);
		const dayNum = String(new Date(dayTimestamp).getDate()).padStart(2, "0");

		const weekDayOpeningTimestamp =
			dayTimestamp -
			weekDayHours * MS_PER_HOUR +
			schedule[weekDayNum].hours.reservationsOpen * MS_PER_HOUR;

		const dayLongShorted = schedule[weekDayNum].dayLong.slice(0, 3);

		const weekDayData = {
			openingTimestamp: weekDayOpeningTimestamp,
			dayData: schedule[weekDayNum],
			dayShort: dayLongShorted,
			monthNum: monthNum,
			dayNum: dayNum,
		};

		week.push(weekDayData);
	}

	return week;
}

export function sortByDay(arr = []) {
	let sortArr = [...arr];

	sortArr.sort((a, b) => {
		return a.day - b.day;
	});

	return sortArr;
}

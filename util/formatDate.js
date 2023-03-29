export function formatDate(date, part = String(), params) {
	if (params) {
		//params - object with individual date parameters (as the solution for time zones)
		//mainly for scheduling the date on the phone's calendar app

		let {
			year: yr,
			month: mo,
			day: dd,
			hours: hr,
			minutes: min,
			weekdayNumber,
		} = params;

		const weekDays = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		let isData = true;

		if ([yr, mo, dd, hr, min, weekdayNumber].some((i) => i === undefined))
			return (isData = false);

		const yrDisp = yr?.toString();
		const moDisp = (mo + 1)?.toString().padStart(2, 0);
		const ddDisp = dd?.toString().padStart(2, 0);
		const hrDisp = hr?.toString();
		const minDisp = min?.toString();
		const timeFormated = `${hrDisp?.padStart(2, 0)}:${minDisp?.padStart(2, 0)}`;

		const weekday = weekDays[weekdayNumber];

		const dateResult = `${ddDisp}-${moDisp}-${yrDisp} ${timeFormated}`;

		return { dateResult, weekday, yr, mo, dd, hr, min, isData };
	}

	const newDate = new Date(date);

	const year = newDate.getFullYear().toString();
	const month = (newDate.getMonth() + 1).toString().padStart(2, 0);
	const day = newDate.getDate().toString().padStart(2, 0);
	const hours = newDate.getHours().toString();
	const minutes = newDate.getMinutes().toString();
	const time = `${hours.padStart(2, 0)}:${minutes.padStart(2, 0)}`;

	const formatedDate = `${day}-${month}-${year} ${time}`;

	if (part) {
		if (part === "onlyDate") {
			const onlyDate = `${day}-${month.padStart(2, 0)}-${year}`;
			return onlyDate;
		}
		if (part === "onlyTime") {
			const onlyTime = `${time}`;
			return onlyTime;
		}
	}

	return formatedDate;
}

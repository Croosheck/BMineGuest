export function formatDate(date, part) {
	const newDate = new Date(date);

	const day = newDate.getDate().toString().padStart(2, 0);
	const month = (newDate.getMonth() + 1).toString();
	const year = newDate.getFullYear().toString();
	const hours = newDate.getHours().toString();
	const minutes = newDate.getMinutes().toString();
	const time = `${hours.padStart(2, 0)}:${minutes.padStart(2, 0)}`;

	const formatedDate = `${day}-${month.padStart(2, 0)}-${year} ${time}`;

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

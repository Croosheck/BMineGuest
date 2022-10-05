export function formatDate(date) {
	const newDate = new Date(date);

	const day = newDate.getDate().toString();
	const month = (newDate.getMonth() + 1).toString();
	const year = newDate.getFullYear().toString();
	const hours = newDate.getHours().toString();
	const minutes = newDate.getMinutes().toString();
	const time = `${hours.padStart(2, 0)}:${minutes.padStart(2, 0)}`;

	const formatedDate = `${day}-${month.padStart(2, 0)}-${year} ${time}`;

	return formatedDate;
}

export function formatDate(date) {
	const newDate = new Date(date);

	const day = newDate.getDate().toString();
	const month = (newDate.getMonth() + 1).toString();
	const year = newDate.getFullYear().toString();
	const time = newDate.toLocaleTimeString();

	const formatedDate = `${day}-${month.padStart(2, 0)}-${year} ${time}`;

	return formatedDate;
}

export function filterReservations({ filter = "", data = [] }) {
	const currentTimestamp = Date.now();

	if (filter === "upcoming") {
		const filtered = data.filter(
			(item) => item.reservationDateTimestamp > currentTimestamp
		);
		return filtered;
	}
	if (filter === "expired") {
		const filtered = data.filter(
			(item) => item.reservationDateTimestamp < currentTimestamp
		);
		return filtered;
	}

	return data;
}

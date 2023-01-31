export function drawerOptionsType({
	reservationDateCategory = String(),
	status = String(),
	general = {
		navigate: () => {},
		call: () => {},
	},
	expired = {
		delete: () => {},
		rate: () => {},
	},
	upcoming = {
		cancel: () => {},
		addCalendar: () => {},
	},
}) {
	if (
		reservationDateCategory === "upcoming" &&
		(status === "confirmed" || status === "pending" || status === "call")
	) {
		return [
			{
				title: "Request cancellation",
				onPress: upcoming.cancel,
			},
			{
				title: "Navigate",
				onPress: general.navigate,
			},
			{
				title: "Call",
				onPress: general.call,
			},
			{
				title: "Add to Calendar",
				onPress: upcoming.addCalendar,
			},
		];
	}

	if (reservationDateCategory === "expired" && status === "confirmed") {
		return [
			{
				title: "Rate us!",
				onPress: expired.rate,
			},
			{
				title: "Delete From History",
				onPress: expired.delete,
			},
			{
				title: "Navigate",
				onPress: general.navigate,
			},
			{
				title: "Call",
				onPress: general.call,
			},
		];
	}

	if (reservationDateCategory === "expired" || status === "cancelled") {
		return [
			{
				title: "Delete From History",
				onPress: expired.delete,
			},
			{
				title: "Navigate",
				onPress: general.navigate,
			},
			{
				title: "Call",
				onPress: general.call,
			},
		];
	}
}

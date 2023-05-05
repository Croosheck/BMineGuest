export function drawerOptionsType({
	reservationDateCategory = String(),
	status = String(),
	general = {
		navigate: () => {},
		call: () => {},
	},
	expired = {
		delete: () => {},
		rating: {
			onPress: () => {},
			title: String(),
		},
	},
	upcoming = {
		cancel: {
			onPress: () => {},
			title: String(),
		},
		addCalendar: () => {},
	},
}) {
	if (
		reservationDateCategory === "upcoming" &&
		(status === "confirmed" || status === "pending" || status === "call")
	) {
		return [
			{
				title: upcoming.cancel.title,
				onPress: upcoming.cancel.onPress,
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
				title: expired.rating.title,
				onPress: expired.rating.onPress,
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

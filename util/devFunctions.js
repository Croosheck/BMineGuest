const openDays = [
	{
		day: 1, //monday
		dayLong: "monday",
		hours: {
			reservationsOpen: 12,
			reservationsClose: 20,
		},
		isOpen: true,
	},
	{
		day: 2, //tuesday
		dayLong: "tuesday",
		isOpen: false,
	},
	{
		day: 3, //wednesday
		dayLong: "wednesday",
		hours: {
			reservationsOpen: 12,
			reservationsClose: 20,
		},
		isOpen: true,
	},
	{
		day: 4, //thursday
		dayLong: "thursday",
		hours: {
			reservationsOpen: 12,
			reservationsClose: 20,
		},
		isOpen: true,
	},
	{
		day: 5, //friday
		dayLong: "friday",
		hours: {
			reservationsOpen: 12,
			reservationsClose: 21,
		},
		isOpen: true,
	},
	{
		day: 6, //saturday
		dayLong: "saturday",
		hours: {
			reservationsOpen: 12,
			reservationsClose: 21,
		},
		isOpen: true,
	},
	{
		day: 0, //sunday
		dayLong: "sunday",
		isOpen: false,
	},
];

async function addOpenDaysHandler(restaurantUid) {
	const restRef = doc(db, "restaurants", restaurantUid);
	await updateDoc(restRef, { openDays });
}

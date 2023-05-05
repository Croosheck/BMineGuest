export function getReservationStatus(itemData) {
	if (
		!itemData.item.confirmed &&
		!itemData.item.cancelled &&
		!itemData.item.callRequest
	)
		return {
			status: "Pending",
			bgColor: "#79B4FDA6",
			type: "pending",
		};
	if (
		!itemData.item.confirmed &&
		!itemData.item.cancelled &&
		itemData.item.callRequest
	)
		return {
			status: "Call Us!",
			bgColor: "#FFFFFFA6",
			type: "call",
		};
	if (itemData.item.confirmed)
		return {
			status: "Confirmed",
			bgColor: "#FFFA66A6",
			type: "confirmed",
		};
	if (itemData.item.cancelled)
		return {
			status: "Cancelled",
			bgColor: "#FF5858A6",
			type: "cancelled",
		};
}

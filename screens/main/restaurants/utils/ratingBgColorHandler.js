export function ratingBgColorHandler(rating = Number()) {
	if (0 < rating && rating <= 2)
		return { bg: "#FF4444CF", text: "#ffffff", textShadow: "#000000" };
	if (2 < rating && rating < 4)
		return { bg: "#FFAB44CF", text: "#ffffff", textShadow: "#000000" };
	if (rating >= 4)
		return { bg: "#ABFF3ECF", text: "#000000", textShadow: "#FFFFFF" };
	if (isNaN(rating))
		return { bg: "#30B7FFCF", text: "#ffffff", textShadow: "#000000" };

	return { bg: "#30B7FFCF", text: "#ffffff", textShadow: "#000000" };
}

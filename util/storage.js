import { auth, db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default async function uploadData(image, type, data) {
	const getDate = new Date();
	const formatedDate = `${getDate.getDate()}-${
		getDate.getMonth() + 1
	}-${getDate.getFullYear()} ${getDate.toLocaleTimeString()}`;

	const fileName = `${formatedDate} (${Math.floor(
		Math.random() * Math.pow(10, 15)
	)})`;

	let imagesRef;

	if (type === "userProfile") {
		imagesRef = ref(
			storage,
			`users/${auth.currentUser.uid}/profilePic/defaultProfile.jpg`
		);
	}
	if (type === "restaurantProfile") {
		imagesRef = ref(
			storage,
			`restaurants/${auth.currentUser.uid}/profilePic/defaultProfile.jpg`
		);
	}

	// In Firestore, creates a child collection "userPosts" under the "posts" parent collection
	if (data) {
		const postRef = doc(
			db,
			"users",
			auth.currentUser.uid,
			"reservations",
			fileName
		);

		setDoc(postRef, {
			filename: fileName,
			rsrvDate: data.rsrvDate ? data.rsrvDate : null,
			timestamp: Date.now(),
			rsrvTimestamp: data.rsrvTimestamp ? data.rsrvTimestamp : null,
			restaurantUid: data.restaurantUid ? data.restaurantUid : null,
			coords: data.coords
				? { lat: data.coords.lat, lng: data.coords.lng }
				: null,
			table: data.table ? data.table : null,
			extras: data.extras ? data.extras : null,
			extrasTotalPrice: data.extrasTotalPrice ? data.extrasTotalPrice : 0,
		});
	}

	if (image) {
		const response = await fetch(image);
		const blob = await response.blob();

		// File's uploading to Firebase Store
		await uploadBytes(imagesRef, blob);

		return { imagesRef, blob, formatedDate };
	}

	return { imagesRef, formatedDate };
}

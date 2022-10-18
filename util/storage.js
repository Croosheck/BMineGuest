import { auth, db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, collection, setDoc, getDocs, query } from "firebase/firestore";

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
		const userReservationRef = doc(
			db,
			"users",
			auth.currentUser.uid,
			"reservations",
			fileName
		);

		const restaurantReservationRef = doc(
			db,
			"restaurants",
			// data.restaurantUid,
			"40TlHHofjEfRZidkxCrr4vfi1Z52",
			"reservations",
			fileName
		);

		setDoc(userReservationRef, {
			filename: fileName,
			reservationDate: data.reservationDate ? data.reservationDate : null,
			reservationDateTimestamp: data.reservationDateTimestamp
				? data.reservationDateTimestamp
				: null,
			madeOnTimestamp: Date.now(),
			restaurantName: data.restaurantName ? data.restaurantName : null,

			//// Not ready ////

			// restaurantUid: data.restaurantUid ? data.restaurantUid : null,

			/* coords: data.coords
				? { lat: data.coords.lat, lng: data.coords.lng }
				: null, */

			table: data.table ? data.table : null,
			extras: data.extras ? data.extras : null,
			extrasTotalPrice: data.extrasTotalPrice ? data.extrasTotalPrice : 0,
			restaurantKey: data.restaurantKey ? data.restaurantKey : null,
		});

		setDoc(restaurantReservationRef, {
			filename: fileName,
			reservationDate: data.reservationDate ? data.reservationDate : null,
			reservationDateTimestamp: data.reservationDateTimestamp
				? data.reservationDateTimestamp
				: null,
			madeOnTimestamp: Date.now(),
			clientsName: data.clientsName ? data.clientsName : null,
			clientsEmail: data.clientsEmail ? data.clientsEmail : null,
			clientsUid: data.clientsUid ? data.clientsUid : null,
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

export async function getReservations() {
	const reservationsQuery = query(
		collection(db, "users", auth.currentUser.uid, "reservations")
	);
	const querySnapshot = await getDocs(reservationsQuery);

	const reservationsData = [];

	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		reservationsData.push(doc.data());
	});

	return reservationsData;
}

import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	doc,
	collection,
	setDoc,
	getDocs,
	query,
	updateDoc,
	increment,
	deleteDoc,
} from "firebase/firestore";

export default async function uploadData(image, type, data) {
	const getDate = new Date();
	const formatedDate = `${getDate.getDate()}-${
		getDate.getMonth() + 1
	}-${getDate.getFullYear()} ${getDate.toLocaleTimeString()}`;

	const fileName = `${formatedDate} (${Math.floor(
		Math.random() * Math.pow(10, 15)
	)})`;

	let imagesRef;

	// Profile pic for client
	if (type === "userProfile") {
		imagesRef = ref(
			storage,
			`users/${auth.currentUser.uid}/profilePic/defaultProfile.jpg`
		);
	}
	// Profile pic for restaurant (in production)
	// if (type === "restaurantProfile") {
	// 	imagesRef = ref(
	// 		storage,
	// 		`restaurants/${auth.currentUser.uid}/restaurantPicture/defaultProfile.jpg`
	// 	);
	// }

	// Fetching out reservation data, to both client's and restaurant's databases
	if (data) {
		const userProfileRef = doc(db, "users", auth.currentUser.uid);
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
			data.restaurantUid,
			"reservations",
			fileName
		);

		setDoc(userReservationRef, {
			filename: fileName,
			reservationDate: data.reservationDate || null,
			reservationDateTimestamp: data.reservationDateTimestamp || null,
			madeOnTimestamp: Date.now(),
			restaurantName: data.restaurantName || null,
			restaurantKey: data.restaurantKey || null,
			restaurantUid: data.restaurantUid || null,

			////// Not ready //////
			/* coords: data.coords
				? { lat: data.coords.lat, lng: data.coords.lng }
				: null, */
			//////////////////////

			table: data.table || null,
			extras: data.extras || null,
			extrasTotalPrice: data.extrasTotalPrice || 0,
			confirmed: false,
			cancelled: false,
			howMany: data.howMany,
			phone: data.phone || "000000000",
		});

		await updateDoc(userProfileRef, {
			totalReservations: increment(1),
		});

		setDoc(restaurantReservationRef, {
			filename: fileName,
			reservationDate: data.reservationDate || null,
			reservationDateTimestamp: data.reservationDateTimestamp || null,
			madeOnTimestamp: Date.now(),
			clientsName: data.clientsName || null,
			clientsEmail: data.clientsEmail || null,
			clientsUid: data.clientsUid || null,
			table: data.table || null,
			extras: data.extras || null,
			extrasTotalPrice: data.extrasTotalPrice || 0,
			confirmed: false,
			cancelled: false,
			howMany: data.howMany,
		});
	}

	if (image) {
		const response = await fetch(image);
		const blob = await response.blob();

		// Files uploading to Firebase Store
		await uploadBytes(imagesRef, blob);

		return { imagesRef, blob, formatedDate };
	}

	return { imagesRef, formatedDate };
}

// Reservations list fetching function
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

export async function getRestaurantProfileImage(restaurantUid) {
	const restaurantProfileRef = ref(
		storage,
		`restaurants/${restaurantUid}/restaurantPicture/defaultProfile.jpg`
	);

	const profileImage = await getDownloadURL(restaurantProfileRef);

	return profileImage;
}

export async function deleteUserReservation(reservationId) {
	const reservationRef = doc(
		db,
		"users",
		auth.currentUser.uid,
		"reservations",
		reservationId
	);

	await deleteDoc(reservationRef);
}

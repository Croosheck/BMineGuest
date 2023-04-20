import { auth, db, storage } from "../firebase";
import {
	getDownloadURL,
	list,
	listAll,
	ref,
	uploadBytes,
} from "firebase/storage";
import {
	doc,
	collection,
	setDoc,
	getDocs,
	query,
	updateDoc,
	increment,
	deleteDoc,
	arrayUnion,
	serverTimestamp,
	getDoc,
} from "firebase/firestore";
import { Alert } from "react-native";

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
			reservationDateParameters: data.reservationDateParameters || null,
			madeOnTimestamp: Date.now(),
			restaurantName: data.restaurantName || null,
			restaurantKey: data.restaurantKey || null,
			restaurantUid: data.restaurantUid || null,
			table: data.table || null,
			extras: data.extras || null,
			extrasTotalPrice: data.extrasTotalPrice || 0,
			confirmed: false,
			cancelled: false,
			howMany: data.howMany,
			phone: data.phone || "000000000",
			url: data.url,
			note: data.note,
		});

		await updateDoc(userProfileRef, {
			totalReservations: increment(1),
		});

		setDoc(restaurantReservationRef, {
			filename: fileName,
			reservationDate: data.reservationDate || null,
			reservationDateTimestamp: data.reservationDateTimestamp || null,
			reservationDateParameters: data.reservationDateParameters || null,
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
			url: data.url,
			note: data.note,
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
	let itemName;

	const imageFolderRef = ref(
		storage,
		`restaurants/${restaurantUid}/restaurantPicture`
	);

	const list = await listAll(imageFolderRef);
	list.items.forEach((item) => (itemName = item.name));

	const restaurantProfileRef = ref(
		storage,
		`restaurants/${restaurantUid}/restaurantPicture/${itemName}`
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

export async function updateUsersRatingStatus(reservationId, rating) {
	const reservationRef = doc(
		db,
		"users",
		auth.currentUser.uid,
		"reservations",
		reservationId
	);

	const ratingData = {
		isRated: true,
		rating: rating,
	};

	await updateDoc(reservationRef, { ratingData });
}

export async function updateRestaurantRating(
	restaurantId = String(),
	rating = Number(),
	reservationId = String(),
	clientsId = auth.currentUser.uid
) {
	const restaurantRatingRef = doc(db, "restaurantRatings", restaurantId);

	await updateDoc(restaurantRatingRef, {
		ratings: arrayUnion({
			rating: rating,
			reservationId: reservationId,
			clientsId: clientsId,
			timestamp: new Date().valueOf(),
		}),
		ratingsSum: increment(rating),
		ratingsTotal: increment(1),
	});
}

export async function cancellationRequest(
	data = {},
	requestData = { requestType: String(), requestMessage: String() },
	callUsCallback = () => {}
) {
	const { reservationDateTimestamp, restaurantUid, filename } = data;

	const restaurantRef = doc(db, "restaurants", restaurantUid);

	const restaurantReservationRef = doc(
		db,
		"restaurants",
		restaurantUid,
		"reservations",
		filename
	);

	const userReservationRef = doc(
		db,
		"users",
		auth.currentUser.uid,
		"reservations",
		filename
	);

	const restaurantSnap = await getDoc(restaurantRef);

	const MS_PER_HOUR = 3600000;
	const MS_PER_DAY = 86400000;
	const dateNow = new Date().getTime();

	if (
		reservationDateTimestamp - dateNow >
		restaurantSnap.data().cancellationAdvance
	) {
		//update for restaurant's database
		updateDoc(restaurantReservationRef, {
			requestData: {
				requestType: requestData.requestType,
				requestMessage: requestData.requestMessage,
				timestamp: dateNow,
			},
		});

		//update for user's database
		updateDoc(userReservationRef, {
			requestData: {
				requestType: requestData.requestType,
				requestMessage: requestData.requestMessage,
				timestamp: dateNow,
			},
		});
	} else {
		Alert.alert("We are not able to process your request.", "Please call us!", [
			{ text: "Back", style: "cancel" },
			{ text: "Call now!", style: "default", onPress: () => callUsCallback() },
		]);
	}

	// console.log(reservationDateTimestamp - dateNow);
}

//swipable gallery inside the restaurant's profile
export async function getRestaurantGalleryImages(
	{ restaurantUid, profileGallery, setCallback } = {
		restaurantUid: "",
		profileGallery: [],
		setCallback: () => {},
	}
) {
	const listRef = ref(storage, `restaurants/${restaurantUid}/profileGallery`);
	const response = await listAll(listRef);

	//prevents from data overlapping
	if (profileGallery.length >= response.items.length) return;

	response.items.forEach(async (item) => {
		const galleryImgRef = ref(
			storage,
			`restaurants/${restaurantUid}/profileGallery/${item.name}`
		);

		const galleryImgUri = await getDownloadURL(galleryImgRef);

		setCallback((gallery) => [...gallery, galleryImgUri]);
	});
}

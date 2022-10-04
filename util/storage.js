import { auth, db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default async function uploadFile(image, type, data) {
	const getDate = new Date();
	const formatedDate = `${getDate.getDate()}-${
		getDate.getMonth() + 1
	}-${getDate.getFullYear()} ${getDate.toLocaleTimeString()}`;

	let imagesRef;

	if (type === "newPost") {
		imagesRef = ref(
			storage,
			`posts/${auth.currentUser.uid}/images/${formatedDate}`
		);
	}

	if (type === "profilePic") {
		imagesRef = ref(
			storage,
			`users/${auth.currentUser.uid}/profilePic/defaultProfile.jpg`
		);
	}

	// In Firestore, creates a child collection "userPosts" under the "posts" parent collection
	if (data) {
		const postRef = doc(
			db,
			"posts",
			auth.currentUser.uid,
			"userPosts",
			formatedDate
		);

		setDoc(postRef, {
			filename: formatedDate,
			title: data.title,
			description: data.description,
			address: data.address ? data.address : null,
			coords: data.coords
				? { lat: data.coords.lat, lng: data.coords.lng }
				: null,
			timestamp: Date.now(),
		});
	}

	const response = await fetch(image);
	const blob = await response.blob();

	// File's uploading to Firebase Store
	await uploadBytes(imagesRef, blob);

	return { imagesRef, blob, formatedDate };
}

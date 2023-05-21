import {
	deleteDoc,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../../firebase";

export async function setAsFavorite({
	restaurantUid = "",
	restaurantName = "",
}) {
	const userFavRef = doc(
		db,
		"users",
		auth.currentUser.uid,
		"favorites",
		restaurantUid
	);

	setDoc(userFavRef, {
		addedTimestamp: serverTimestamp(),
		restaurantName: restaurantName,
	});
}

export async function getFavorite({ restaurantUid = "" }) {
	const userFavRef = doc(
		db,
		"users",
		auth.currentUser.uid,
		"favorites",
		restaurantUid
	);

	const docSnap = await getDoc(userFavRef);

	if (docSnap.exists()) return true;
	if (!docSnap.exists()) return false;
}

export async function removeFavorite(restaurantUid = "") {
	const userFavRef = doc(
		db,
		"users",
		auth.currentUser.uid,
		"favorites",
		restaurantUid
	);

	await deleteDoc(userFavRef);
}

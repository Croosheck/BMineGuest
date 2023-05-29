import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
} from "firebase/firestore";
import { auth, db, storage } from "../../../../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export async function getRestaurantData(id = "") {
	const restaurantRef = doc(db, "restaurants", id);

	const docSnap = await getDoc(restaurantRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}
}

export async function getFavs({ listLimit = 2 }) {
	const favsData = [];
	let favsQuery;

	const favsRef = collection(db, "users", auth.currentUser.uid, "favorites");

	if (listLimit !== 0) {
		favsQuery = query(
			favsRef,
			orderBy("addedTimestamp", "desc"),
			limit(listLimit + 1)
		);
	} else {
		favsQuery = query(favsRef, orderBy("addedTimestamp", "desc"));
	}

	const favsSnapshot = await getDocs(favsQuery);

	//iterates through the 'favorites' collection
	for (const [index, fav] of favsSnapshot.docs.entries()) {
		if (listLimit !== 0) {
			if (
				index === favsSnapshot.docs.length - 1 &&
				listLimit < favsSnapshot.docs.length
			)
				return { isMoreThanLimit: true, favsData: favsData };
		}

		const profileImageRef = ref(
			storage,
			`restaurants/${fav.id}/restaurantPicture`
		);
		const storageFiles = await listAll(profileImageRef);

		const data = await getRestaurantData(fav.id);

		for (const item of storageFiles.items) {
			const restaurantImgRef = ref(storage, item.fullPath);
			const profileImgUri = await getDownloadURL(restaurantImgRef);

			favsData.push({
				name: data.name,
				url: profileImgUri,
				id: fav.id,
			});
		}
	}

	return { isMoreThanLimit: false, favsData: favsData };
}

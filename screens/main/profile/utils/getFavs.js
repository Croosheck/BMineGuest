import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db, storage } from "../../../../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export async function getRestaurantData(id = "") {
	const restaurantRef = doc(db, "restaurants", id);

	const docSnap = await getDoc(restaurantRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}
}

export async function getFavs({ stateCallback = () => {} }) {
	stateCallback([]);

	const favsRef = collection(db, "users", auth.currentUser.uid, "favorites");
	const favsSnapshot = await getDocs(favsRef);

	//iterates through the 'favorites' collection
	for (const fav of favsSnapshot.docs) {
		const profileImageRef = ref(
			storage,
			`restaurants/${fav.id}/restaurantPicture`
		);
		const storageFiles = await listAll(profileImageRef);

		const data = await getRestaurantData(fav.id);

		for (const item of storageFiles.items) {
			const restaurantImgRef = ref(storage, item.fullPath);
			const profileImgUri = await getDownloadURL(restaurantImgRef);

			stateCallback((prev) => [
				...prev,
				{
					name: data.name,
					url: profileImgUri,
					id: fav.id,
				},
			]);
		}
	}
}

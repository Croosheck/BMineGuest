import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import ItemTile from "../../components/ItemTile";
import { storage } from "../../firebase";
import { addExtra, removeExtra } from "../../redux/slices/user";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";

const Extras = ({ route }) => {
	const [extraItems, setExtraItems] = useState();
	const [extraImages, setExtraImages] = useState({});
	const { availableRestaurants, reservationData } = useSelector(
		(state) => state.userReducer
	);

	const { restaurantKey } = route.params;

	const dispatch = useDispatch();

	let pickedRestaurant;
	let modifiedExtras;

	const pickedRestaurantWithoutIndexes = availableRestaurants.filter(
		(restaurant) => restaurant.key === restaurantKey
	)[0];

	modifiedExtras = pickedRestaurantWithoutIndexes.extras.map((extra, i) => ({
		...extra,
		index: i,
		picked: false,
	}));

	pickedRestaurant = {
		...pickedRestaurantWithoutIndexes,
		extras: [...modifiedExtras],
	};

	useEffect(() => {
		setExtraItems(pickedRestaurant.extras);

		async function getExtraImages() {
			const listRef = ref(storage, "extras");

			const response = await listAll(listRef);

			if (extraImages.length === response.items.length) return;

			response.items.forEach(async (item) => {
				const extraImgRef = ref(storage, `extras/${item.name}`);
				const extraImgUri = await getDownloadURL(extraImgRef);

				setExtraImages((prev) => {
					// Cut the image extension (mostly .png's)
					const itemName = item.name.match(/^.*(?=(\.))/g).join("");

					return {
						...prev,
						[itemName]: extraImgUri,
					};
				});
			});
		}
		getExtraImages();
	}, [availableRestaurants]);

	function manageExtra(itemData) {
		// Highlight picked extra
		itemData.item.picked = !itemData.item.picked;

		const xShortFilename = itemData.item.xFileName
			.match(/^.*(?=(\.))/g)
			.join("");

		// Add picked extra to data object
		if (itemData.item.picked) {
			dispatch(
				addExtra({
					xName: itemData.item.xName,
					xPrice: itemData.item.xPrice,
					xFileName: itemData.item.xFileName,
					xShortFileName: xShortFilename,
					xImage: extraImages[xShortFilename],
				})
			);
		}

		// If picked (highlighted) - remove on click
		if (!itemData.item.picked) {
			const disableItem = reservationData.extras.find(
				(item) => item.xName === itemData.item.xName
			);

			dispatch(removeExtra(disableItem.xName));
		}
	}

	return (
		<LinearGradient style={styles.container} colors={["#000A2B", "#545351"]}>
			{extraItems && (
				<FlatList
					data={extraItems}
					numColumns={2}
					renderItem={(itemData) => {
						let itemName = itemData.item.xFileName;

						if (itemData.item.xFileName.includes(".")) {
							itemName = itemData.item.xFileName.match(/^.*(?=(\.))/g).join("");
						}

						return (
							<ItemTile
								title={`${itemData.item.xName}`}
								textBelow={`${
									itemData.item.xPrice === 0
										? "Free"
										: itemData.item.xPrice + "$"
								}`}
								onPress={() => manageExtra(itemData)}
								picked={itemData.item.picked}
								imgUri={extraImages[itemName]}
							/>
						);
					}}
				/>
			)}
			<Text style={styles.totalPriceContainer}>
				Total price:{" "}
				{reservationData.extras
					.reduce((acc, item) => {
						return acc + item.xPrice;
					}, 0)
					.toFixed(2) + "$"}
			</Text>
		</LinearGradient>
	);
};

export default memo(Extras);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
	totalPriceContainer: {
		color: "#ffffff",
		fontWeight: "500",
		fontSize: 20,
		paddingTop: 3,
		textAlign: "center",
	},
});

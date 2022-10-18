import { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useDispatch, useSelector } from "react-redux";
import ItemTile from "../../components/ItemTile";
import { addExtra, removeExtra, extraPicked } from "../../redux/slices/user";

const Extras = ({ route }) => {
	const [extraItems, setExtraItems] = useState();
	const { availableRestaurants, reservationData } = useSelector(
		(state) => state.userReducer
	);

	const { restaurantKey } = route.params;

	const dispatch = useDispatch();

	let pickedRestaurant;

	useEffect(() => {
		pickedRestaurant = availableRestaurants.filter(
			(restaurant) => restaurant.key === restaurantKey
		);
		setExtraItems(pickedRestaurant[0].extras);
	}, [availableRestaurants]);

	function manageExtra(itemData) {
		// Highlight picked extra
		dispatch(
			extraPicked({
				key: restaurantKey,
				extraIndex: itemData.index,
			})
		);

		const xShortFilename = itemData.item.xFileName.includes(".")
			? itemData.item.xFileName.slice(0, -4)
			: itemData.item.xFileName;

		// Add picked extra to data object
		if (!itemData.item.xPicked) {
			dispatch(
				addExtra({
					xName: itemData.item.xName,
					xPrice: itemData.item.xPrice,
					xFileName: itemData.item.xFileName,
					xShortFileName: xShortFilename,
				})
			);
		}

		// If picked (highlighted) - remove on click
		if (itemData.item.xPicked) {
			const disableItem = reservationData.extras.find(
				(item) => item.xName === itemData.item.xName
			);

			dispatch(removeExtra(disableItem.xName));
		}
	}

	return (
		<View style={styles.container}>
			{extraItems && (
				<FlatList
					data={extraItems}
					numColumns={2}
					renderItem={(itemData) => {
						return (
							<ItemTile
								title={`${itemData.item.xName}`}
								textBelow={`${
									itemData.item.xPrice === 0 ? "Free" : itemData.item.xPrice
								}`}
								onPress={() => manageExtra(itemData)}
								picked={itemData.item.xPicked}
							/>
						);
					}}
				/>
			)}
			{reservationData.extras && (
				<ScrollView>
					<View style={{ flexDirection: "column" }}>
						{reservationData.extras.map((item) => {
							return (
								<Text
									key={Math.random() * 1000000}
									style={{ color: "#ffffff" }}
								>
									- {item.xName}
								</Text>
							);
						})}
					</View>
				</ScrollView>
			)}
			<Text style={{ color: "#ffffff", fontWeight: "500", fontSize: 20 }}>
				Total price:{" "}
				{reservationData.extras.reduce((acc, item) => {
					return acc + item.xPrice;
				}, 0)}
			</Text>
		</View>
	);
};

export default Extras;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#311A1A",
		padding: 8,
	},
	text: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
	},
});

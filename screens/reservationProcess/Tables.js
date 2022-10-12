import { Dimensions, FlatList, StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
	addTable,
	removeReservationItem,
	tablePicked,
} from "../../redux/slices/user";

import ItemTile from "../../components/ItemTile";
import { useEffect, useState } from "react";

const Tables = ({ route }) => {
	const [tables, setTables] = useState();

	const { availableRestaurants } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	const { restaurantKey } = route.params;

	let pickedRestaurant;

	useEffect(() => {
		pickedRestaurant = availableRestaurants.filter(
			(restaurant) => restaurant.key === restaurantKey
		);
		setTables(pickedRestaurant[0].tables);
	}, [availableRestaurants]);

	function addDataHandler(itemData) {
		dispatch(
			addTable({
				table: {
					tShape: itemData.item.tShape,
					tSeats: itemData.item.tSeats,
				},
			})
		);
		dispatch(
			tablePicked({
				key: restaurantKey,
				tableIndex: itemData.index,
			})
		);
	}

	function removeDataHandler() {
		dispatch(removeReservationItem({ table: "" }));
	}

	return (
		<View style={styles.container}>
			{tables && (
				<FlatList
					data={tables}
					numColumns={2}
					renderItem={(itemData) => {
						return (
							<ItemTile
								title={`${itemData.item.tShape}`}
								textBelow={`${itemData.item.tSeats}`}
								onPress={() => addDataHandler(itemData)}
								picked={itemData.item.tPicked}
								iconName="human-male-female"
								iconSize={20}
								iconColor="#ffffff"
							/>
						);
					}}
				/>
			)}
		</View>
	);
};

export default Tables;

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

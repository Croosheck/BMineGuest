import { Dimensions, FlatList, StyleSheet, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
	addReservationItem,
	removeReservationItem,
	tablePicked,
} from "../../redux/slices/user";

import TableTile from "../../components/TableTile";
import { RESTAURANTS } from "../../util/restaurants";
import { useEffect, useState } from "react";

const Tables = () => {
	const [tables, setTables] = useState();
	const [tabPicked, setTabPicked] = useState(false);

	const { availableRestaurants } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	let pickedRestaurant;
	let restaurantKey = 2;

	useEffect(() => {
		pickedRestaurant = availableRestaurants.filter(
			(restaurant) => restaurant.key === restaurantKey
		);
		setTables(pickedRestaurant[0].tables);
	}, [availableRestaurants]);

	function addDataHandler(itemData) {
		dispatch(
			addReservationItem({
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

		console.log(itemData.item.tPicked);
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
							<TableTile
								shape={itemData.item.tShape}
								seats={itemData.item.tSeats}
								onPress={() => addDataHandler(itemData)}
								picked={itemData.item.tPicked}
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

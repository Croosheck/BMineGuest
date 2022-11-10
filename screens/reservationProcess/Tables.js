import { Button, Dimensions, FlatList, StyleSheet, View } from "react-native";

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

	const { restaurantKey, howMany } = route.params;

	let pickedRestaurant;
	let filteredTables = [];

	useEffect(() => {
		filteredTables = [];

		pickedRestaurant = availableRestaurants.filter(
			(restaurant) => restaurant.key === restaurantKey
		);

		// Filter tables based on number of people (to avoid wasting free places)
		function findTablesHandler(difference = 0, all = false) {
			pickedRestaurant[0].tables.forEach((table, i) => {
				if (all && table.tAvailability && table.tSeats / howMany <= 3) {
					filteredTables.push({ ...table, index: i });
					return;
				}
				if (
					table.tAvailability &&
					table.tSeats === howMany &&
					table.tSeats % howMany === 0 &&
					table.tSeats % howMany === difference &&
					difference === 0
				) {
					filteredTables.push({ ...table, index: i });
				}
				if (
					table.tAvailability &&
					difference !== 0 &&
					table.tSeats / howMany >= 1 &&
					table.tSeats / howMany < 2 &&
					table.tSeats % howMany <= difference
				) {
					filteredTables.push({ ...table, index: i });
				}
			});
		}

		//Try to find tables equal to a number of people only
		findTablesHandler();

		//If there's none of these, find tables greater by 1 seat
		if (filteredTables.length === 0) {
			findTablesHandler(1);
		}

		//If there's none of these, find tables greater by 2 seat
		if (filteredTables.length === 0) {
			findTablesHandler(2);
		}

		//If there's none of these, list ALL AVAILABLE tables
		// (not greater than 3 * number of people)
		if (filteredTables.length === 0) {
			findTablesHandler(0, true);
		}

		setTables(filteredTables);
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
				tableIndex: itemData.item.index,
			})
		);
	}

	function removeDataHandler() {
		dispatch(removeReservationItem({ table: "" }));
	}

	return (
		<View style={styles.container}>
			<View style={styles.categoriesContainer}>
				<Button title="All" />
				<Button title="Main hall" />
				<Button title="Terrace" />
				<Button title="Lobby" />
			</View>
			{tables && (
				<FlatList
					style={styles.tablesListContainer}
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
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
		padding: 8,
		paddingTop: 0,
	},
	categoriesContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "#5E5E5E23",
		height: 50,
		width: Dimensions.get("window").width,
		// borderWidth: 6,
		paddingVertical: 8,
	},
	tablesListContainer: {
		width: "100%",
	},
});

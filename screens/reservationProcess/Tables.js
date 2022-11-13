import { useEffect, useState } from "react";
import {
	Button,
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import {
	addTable,
	removeReservationItem,
	tablePicked,
} from "../../redux/slices/user";

import TableTile from "../../components/TableTile";

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
					return;
				}
				if (
					table.tAvailability &&
					difference !== 0 &&
					table.tSeats / howMany >= 1 &&
					table.tSeats / howMany < 2 &&
					table.tSeats % howMany <= difference
				) {
					filteredTables.push({ ...table, index: i });
					return;
				}
			});
		}

		// //Try to find tables equal to a number of people only
		// findTablesHandler();

		// //If there's none of these, find tables greater by 1 seat
		// if (filteredTables.length === 0) {
		// 	findTablesHandler(1);
		// }

		// //If there's none of these, find tables greater by 2 seat
		// if (filteredTables.length === 0) {
		// 	findTablesHandler(2);
		// }

		// //If there's none of these, list ALL AVAILABLE tables
		// // (not greater than 3 * number of people)
		// if (filteredTables.length === 0) {
		// 	findTablesHandler(0, true);
		// }

		// setTables(filteredTables);

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
				// tableIndex: itemData.item.index,
				tableIndex: itemData.index,
			})
		);
	}

	function removeDataHandler() {
		dispatch(removeReservationItem({ table: "" }));
	}

	const tableImage = {
		448215317: require("../../assets/test/448215317.jpg"),
		1082098712: require("../../assets/test/1082098712.jpg"),
		3030495495: require("../../assets/test/3030495495.jpg"),
		5297085268: require("../../assets/test/5297085268.jpg"),
		9144166763: require("../../assets/test/9144166763.jpg"),
		9991969801: require("../../assets/test/9991969801.jpg"),
	};

	function filterTablesHandler(placement) {
		pickedRestaurant = availableRestaurants.filter(
			(restaurant) => restaurant.key === restaurantKey
		);

		if (placement === "All") {
			setTables(pickedRestaurant[0].tables);
			return;
		}
		const filtered = pickedRestaurant[0].tables.filter(
			(table) => table.tPlacement === placement
		);
		setTables(filtered);
	}

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.placementButtonsContainer}
				contentContainerStyle={styles.placementContentContainer}
				horizontal
			>
				<View style={styles.placementButtonContainer}>
					<Button title="All" onPress={filterTablesHandler.bind(this, "All")} />
				</View>
				<View style={styles.placementButtonContainer}>
					<Button
						title="1st Floor"
						onPress={filterTablesHandler.bind(this, "1st Floor")}
					/>
				</View>
				<View style={styles.placementButtonContainer}>
					<Button
						title="2nd Floor"
						onPress={filterTablesHandler.bind(this, "2nd Floor")}
					/>
				</View>
				<View style={styles.placementButtonContainer}>
					<Button
						title="Terrace"
						onPress={filterTablesHandler.bind(this, "Terrace")}
					/>
				</View>
				<View style={styles.placementButtonContainer}>
					<Button
						title="Outside"
						onPress={filterTablesHandler.bind(this, "Outside")}
					/>
				</View>
			</ScrollView>
			{tables && (
				<FlatList
					data={tables}
					style={styles.tablesListContainer}
					numColumns={1}
					renderItem={(itemData) => {
						return (
							<TableTile
								title={`${itemData.item.tShape}`}
								textBelow={`${itemData.item.tSeats}`}
								onPress={() => addDataHandler(itemData)}
								picked={itemData.item.tPicked}
								iconName="human-male-female"
								iconSize={20}
								iconColor="#ffffff"
								imgUri={tableImage[itemData.item.tId]}
								tPlacement={itemData.item.tPlacement}
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
		paddingTop: 0,
	},
	placementButtonsContainer: {
		backgroundColor: "#5E5E5E23",
		width: Dimensions.get("window").width,
		zIndex: 999,
	},
	placementContentContainer: {
		paddingVertical: 8,
		justifyContent: "space-around",
		alignItems: "center",
	},
	placementButtonContainer: {
		marginHorizontal: 10,
		width: 100,
	},
	tablesListContainer: {
		height: "100%",
		width: "100%",
	},
});

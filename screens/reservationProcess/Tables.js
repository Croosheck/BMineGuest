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
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../firebase";

const Tables = ({ route }) => {
	const [tables, setTables] = useState();
	const [tableImages, setTableImages] = useState({});
	const [filteredPlacements, setFilteredPlacements] = useState([]);

	const { availableRestaurants } = useSelector((state) => state.userReducer);

	const dispatch = useDispatch();

	const { restaurantKey, howMany } = route.params;

	let pickedRestaurant;
	let filteredTables = [];
	let allPlacementsButtons = [];
	let modifiedTables;

	const pickedRestaurantWithoutIndexes = availableRestaurants.find(
		(restaurant) => restaurant.key === restaurantKey
	);

	//Adding index and picked properties, to allow highlighting functionality
	modifiedTables = pickedRestaurantWithoutIndexes.tables.map((table, i) => ({
		...table,
		index: i,
		picked: false,
	}));

	pickedRestaurant = {
		...pickedRestaurantWithoutIndexes,
		tables: [...modifiedTables],
	};

	useEffect(() => {
		filteredTables = [];

		allPlacementsButtons = pickedRestaurant.tables.map(
			(table) => table.tPlacement
		);
		setFilteredPlacements(["All", ...new Set(allPlacementsButtons)]);

		async function getTablesImages() {
			const listRef = ref(
				storage,
				`restaurants/${pickedRestaurant.uid}/tables`
			);

			const response = await listAll(listRef);

			if (tableImages.length === response.items.length) return;

			response.items.forEach(async (item) => {
				const tableImgRef = ref(
					storage,
					`restaurants/${pickedRestaurant.uid}/tables/${item.name}`
				);

				const tableImgUri = await getDownloadURL(tableImgRef);

				setTableImages((prev) => {
					// Cut the image extension (mostly .jpg's)
					const itemName = item.name.slice(0, -4);

					return {
						...prev,
						[itemName]: tableImgUri,
					};
				});
			});
		}

		// Filter tables based on number of people (to avoid wasting free places)
		function findTablesHandler(difference = 0, all = false) {
			pickedRestaurant.tables.forEach((table, i) => {
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

		setTables(pickedRestaurant.tables);
		getTablesImages();
	}, []);

	function addDataHandler(itemData) {
		dispatch(
			addTable({
				table: {
					tShape: itemData.item.tShape,
					tSeats: itemData.item.tSeats,
					tPlacement: itemData.item.tPlacement,
				},
			})
		);

		//Item highlighting logic
		setTables((prev) => {
			if (prev.some((table) => table.picked === true)) {
				prev.forEach((table) => (table.picked = false));
			}

			prev[itemData.index].picked = true;
			return prev;
		});
	}

	// const tableImage = {
	// 	118427365: require("../../assets/test/118427365.jpg"),
	// 	1082098712: require("../../assets/test/1082098712.jpg"),
	// 	1152363266: require("../../assets/test/1152363266.jpg"),
	// 	1236348563: require("../../assets/test/1236348563.jpg"),
	// 	3030495495: require("../../assets/test/3030495495.jpg"),
	// 	5236388674: require("../../assets/test/5236388674.jpg"),
	// 	6347299673: require("../../assets/test/6347299673.jpg"),
	// 	8124363672: require("../../assets/test/8124363672.jpg"),
	// 	9991969801: require("../../assets/test/9991969801.jpg"),
	// };

	function filterTablesHandler(placement) {
		if (placement === "All") {
			setTables(pickedRestaurant.tables);
			return;
		}
		const filtered = pickedRestaurant.tables.filter(
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
				{filteredPlacements.map((placement, i) => {
					return (
						<View style={styles.placementButtonContainer} key={i}>
							<Button
								title={placement}
								onPress={filterTablesHandler.bind(this, placement)}
							/>
						</View>
					);
				})}
			</ScrollView>
			{tables && (
				<FlatList
					data={tables}
					style={styles.tablesListContainer}
					numColumns={1}
					renderItem={(itemData) => {
						return (
							<TableTile
								// title={`${itemData.item.tShape}`}
								textBelow={`${itemData.item.tSeats}`}
								onPress={() => addDataHandler(itemData)}
								picked={itemData.item.picked}
								iconName="human-male-female"
								iconSize={20}
								iconColor="#ffffff"
								imgUri={tableImages[itemData.item.tId]}
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

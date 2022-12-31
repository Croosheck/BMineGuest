import { useEffect, useState } from "react";
import {
	Button,
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import OutlinedButton from "../../components/OutlinedButton";

import { useDispatch, useSelector } from "react-redux";
import { addTable } from "../../redux/slices/user";

import TableTile from "../../components/TableTile";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../firebase";
import FilterButton from "../../components/FilterButton";

const Tables = ({ route }) => {
	const [tables, setTables] = useState([]);
	const [tableImages, setTableImages] = useState({});
	const [filteredPlacements, setFilteredPlacements] = useState([]);
	const [message, setMessage] = useState("");

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

		if (pickedRestaurant.tablesFiltering) {
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
		}

		if (!pickedRestaurant.tablesFiltering) {
			setTables(pickedRestaurant.tables);
		}

		getTablesImages();
	}, []);

	function addDataHandler(itemData) {
		dispatch(
			addTable({
				table: {
					tId: itemData.item.tId,
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
		findTablesHandler();

		if (placement === "All") {
			setTables(filteredTables);

			return;
		}

		const filtered = filteredTables.filter(
			(table) => table.tPlacement === placement
		);
		setTables(filtered);
		if (filtered.length === 0) {
			setMessage(`Nothing on the ${placement} category is available.`);
		}
	}

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.placementButtonsContainer}
				contentContainerStyle={styles.placementContentContainer}
				horizontal
				fadingEdgeLength={50}
				showsHorizontalScrollIndicator={false}
			>
				{filteredPlacements.map((placement, i) => {
					return (
						<FilterButton
							key={i}
							title={placement}
							onPress={filterTablesHandler.bind(this, placement)}
							style={styles.filterButton}
						/>
					);
				})}
			</ScrollView>
			{tables.length > 0 ? (
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
			) : (
				<View style={styles.messageContainer}>
					<Text style={styles.messageContent}>{message}</Text>
				</View>
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
	},
	placementButtonsContainer: {
		maxHeight: "10%",
	},
	placementContentContainer: {
		alignItems: "center",
		height: 40,
		marginVertical: 10,
	},
	filterButton: {
		backgroundColor: "#794D4D",
		marginHorizontal: 10,
		padding: 10,
		width: 100,
	},
	tablesListContainer: {
		height: "100%",
		width: "100%",
	},
	messageContainer: {
		height: "90%",
		justifyContent: "center",
	},
	messageContent: {
		color: "#ffffff",
		fontSize: 18,
	},
});

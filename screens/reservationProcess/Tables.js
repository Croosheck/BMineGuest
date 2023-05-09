import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import TableTile from "../../components/TableTile";
import FilterButton from "../../components/FilterButton";
import { normalizeFontSize } from "../../util/normalizeFontSize";

import { useDispatch } from "react-redux";
import { addTable } from "../../redux/slices/user";

import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../firebase";

const Tables = ({ route }) => {
	const [tables, setTables] = useState([]);
	const [tableImages, setTableImages] = useState({});
	const [filteredPlacements, setFilteredPlacements] = useState([]);
	const [placementType, setPlacementType] = useState("All");
	const [message, setMessage] = useState("");
	const [pickedTable, setPickedTable] = useState({
		id: "",
	});
	const [filteringOffset, setFilteringOffset] = useState({
		difference: 0,
		all: false,
	});

	const dispatch = useDispatch();

	const {
		howMany,
		tables: restaurantTables,
		tablesFiltering,
		restaurantUid,
	} = route.params;

	let filteredTables = [];
	let allPlacementsButtons = [];

	const availableTables = restaurantTables.filter(
		(table) => table.tAvailability
	);

	// Filter tables based on number of people (to avoid wasting free places)
	function findTablesHandler(difference = 0) {
		let isTable = false;

		availableTables.forEach((table) => {
			//tables with seats num equal to num of guests
			if (difference === 0 && table.tSeats === howMany) {
				filteredTables.push(table);
				return (isTable = true);
			}

			//tables with seats num greater than num of guests, but not
			if (table.tSeats - howMany <= difference && table.tSeats > howMany) {
				filteredTables.push(table);
				return (isTable = true);
			}
		});

		return isTable;
	}

	async function getTablesImages() {
		const listRef = ref(storage, `restaurants/${restaurantUid}/tables`);

		const response = await listAll(listRef);

		if (tableImages.length === response.items.length) return;

		response.items.forEach(async (item) => {
			const tableImgRef = ref(
				storage,
				`restaurants/${restaurantUid}/tables/${item.name}`
			);

			const tableImgUri = await getDownloadURL(tableImgRef);

			setTableImages((prev) => {
				let itemName = item.name;

				// Cut the image extension
				if (item.name.includes(".")) {
					itemName = item.name.match(/^.*(?=(\.))/g).join("");
				}

				return {
					...prev,
					[itemName]: tableImgUri,
				};
			});
		});
	}

	function findCorrespondingTable(capacityOffset = [0, 1, 2, 3, 6]) {
		let isAnyTable = false;

		//1# - tries to look for a table with seats num equal to a number of people only
		//// if no results...
		//2# - tries to look for any table with seats num greater than num of guests,
		// for each capacityOffset value, but NOT GREATER...
		// -> [num of guests] + [difference]
		for (let i = 0; i < capacityOffset.length; i++) {
			if (isAnyTable) break;
			isAnyTable = findTablesHandler(capacityOffset[i]);
			setFilteringOffset({
				difference: capacityOffset[i],
			});
		}

		setTables(filteredTables);
	}

	useEffect(() => {
		filteredTables = [];

		//filters displayed filtering buttons based on tables availability
		const filteredPlacementsButtons = availableTables.filter(
			(table) => table.tAvailability
		);

		for (let i = 0; i < filteredPlacementsButtons.length; i++) {
			if (filteredPlacementsButtons[i].tPlacement.length > 0) {
				//use a filter, only if a table placement is defined
				allPlacementsButtons.push(filteredPlacementsButtons[i].tPlacement);
			}
		}

		if (allPlacementsButtons.length > 0) {
			setFilteredPlacements(["All", ...new Set(allPlacementsButtons)]);
		}

		if (tablesFiltering) {
			findCorrespondingTable();
		}

		if (!tablesFiltering) {
			setTables(availableTables);
		}

		getTablesImages();
	}, []);

	// data forwarding of the selected table
	function addDataHandler(itemData) {
		dispatch(
			addTable({
				table: {
					tId: itemData.item.tId,
					tShape: itemData.item.tShape,
					tSeats: itemData.item.tSeats,
					tPlacement: itemData.item.tPlacement,
					tImage: tableImages[itemData.item.tId],
				},
			})
		);

		//For item highlighting
		setPickedTable({
			id: itemData.item.tId,
		});
	}

	function filterTablesHandler(placement) {
		setPlacementType(placement);

		// for saving tables mode
		if (tablesFiltering) {
			const { difference } = filteringOffset;

			findTablesHandler(difference);

			if (placement === "All") {
				setTables(filteredTables);
				return;
			}

			const filtered = filteredTables.filter(
				(table) => table.tPlacement === placement
			);

			setTables(filtered);

			if (filtered.length === 0) {
				setMessage(`Nothing in the ${placement} category is available.`);
			}

			return;
		}

		// with tables saving mode disabled
		if (placement === "All") {
			setTables(availableTables);
			return;
		}

		const filtered = availableTables.filter(
			(table) => table.tPlacement === placement
		);

		setTables(filtered);
	}

	return (
		<LinearGradient style={styles.container} colors={["#000A2B", "#545351"]}>
			{filteredPlacements.length > 0 && (
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
								style={[
									styles.filterButton,
									//highlight active state
									placementType === placement && styles.filterActive,
								]}
								titleStyle={[
									styles.filterTitle,
									{ fontSize: normalizeFontSize(16) },
								]}
								disPressAnim
							/>
						);
					})}
				</ScrollView>
			)}
			{tables.length > 0 ? (
				<FlatList
					data={tables}
					style={styles.tablesListContainer}
					numColumns={1}
					renderItem={(itemData) => {
						return (
							<TableTile
								seatsQuantity={`${itemData.item.tSeats}`}
								onPress={() => addDataHandler(itemData)}
								picked={pickedTable.id === itemData.item.tId}
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
					<Text
						style={[styles.messageContent, { fontSize: normalizeFontSize(18) }]}
					>
						{!!message ? message : "No available tables."}
					</Text>
				</View>
			)}
		</LinearGradient>
	);
};

export default Tables;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	placementButtonsContainer: {
		// maxHeight: "10%",
	},
	placementContentContainer: {
		alignItems: "center",
		height: 40,
		marginVertical: 10,
	},
	filterButton: {
		backgroundColor: "#794D4D",
		marginHorizontal: 10,
		overflow: "hidden",
		minHeight: 40,
		minWidth: 100,
	},
	filterActive: {
		backgroundColor: "#D0B8B8",
	},
	filterTitle: {
		width: "100%",
		textShadowColor: "#000000B8",
		textShadowRadius: 8,
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
	},
});

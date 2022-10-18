import {
	Dimensions,
	FlatList,
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useState } from "react";
import { formatDate } from "../../util/dateFormat";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";
import ExtraItem from "./ExtraItem";

const ReservationListItem = ({
	restaurantName,
	reservationDateTimestamp,
	madeOnDate,
	table,
	extras,
	extraImages,
}) => {
	const [displayedExtraName, setDisplayedExtraName] = useState("");

	const formatedReservationDate = formatDate(reservationDateTimestamp);
	const formatedMadeOnDate = formatDate(madeOnDate);

	function displayExtraName(itemData) {
		setDisplayedExtraName(`${itemData.item.xName} (${itemData.item.xPrice}$)`);
	}

	return (
		<View style={styles.container}>
			<View style={styles.dataContainer}>
				<Text style={styles.restaurantName}>{restaurantName}</Text>
				<Text style={styles.dates}>
					Reservation Date: {formatedReservationDate}
				</Text>
				<Text style={styles.dates}>Reserved on: {formatedMadeOnDate}</Text>
			</View>
			<View style={styles.extrasContainer}>
				<FlatList
					data={extras}
					keyExtractor={(item, index) => index}
					horizontal={true}
					style={styles.extrasFlatList}
					contentContainerStyle={styles.extrasFlatListContent}
					renderItem={(itemData) => {
						return (
							<ExtraItem
								onPress={displayExtraName.bind(this, itemData)}
								imgUri={
									extraImages && extraImages[`${itemData.item.xShortFileName}`]
								}
							/>
						);
					}}
				/>
				<Text style={styles.displayedExtraName}>{displayedExtraName}</Text>
			</View>
		</View>
	);
};

export default ReservationListItem;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: Dimensions.get("window").width * 0.7,
		margin: Dimensions.get("window").width * 0.03,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#181818",
		borderWidth: 2,
		borderColor: "#ffffff",
		borderRadius: 15,
	},
	dataContainer: {
		flex: 0.7,
		justifyContent: "center",
		alignItems: "center",
	},
	restaurantName: {
		color: "#ffffff",
		fontSize: 20,
		fontWeight: "500",
	},
	dates: {
		color: "#ffffff",
		fontSize: 16,
	},
	extrasContainer: {
		flex: 0.4,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#280000",
		borderTopWidth: 2,
		// borderBottomWidth: 2,
		borderColor: "#ffffff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	extrasFlatList: {
		maxHeight: Dimensions.get("window").width * 0.16,
		borderBottomWidth: 2,
		borderColor: "#ffffff",
	},
	extrasFlatListContent: {},

	displayedExtraName: {
		color: "#ffffff",
		fontSize: 16,
		marginTop: 4,
	},
});

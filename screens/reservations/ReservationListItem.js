import {
	Dimensions,
	FlatList,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { formatDate } from "../../util/dateFormat";
import ExtraItem from "./ExtraItem";
import { getRestaurantProfileImage } from "../../util/storage";
import { LinearGradient } from "expo-linear-gradient";

const ReservationListItem = ({
	restaurantName,
	reservationDateTimestamp,
	madeOnDate,
	table,
	extras,
	extraImages,
	restaurantUid,
}) => {
	const [displayedExtraName, setDisplayedExtraName] = useState();
	const [reservationBackgroundUri, setReservationBackgroundUri] = useState();

	const formatedReservationDate = formatDate(reservationDateTimestamp);
	const formatedMadeOnDate = formatDate(madeOnDate);

	function displayExtraName(itemData) {
		setDisplayedExtraName(`${itemData.item.xName} (${itemData.item.xPrice}$)`);
	}

	useEffect(() => {
		async function getRestaurantDataHandler() {
			const profileImage = await getRestaurantProfileImage(restaurantUid);
			setReservationBackgroundUri(profileImage);
		}

		getRestaurantDataHandler();
	}, []);

	return (
		<LinearGradient
			colors={["#000000CC", "#FFFFFF", "#020202B7"]}
			style={styles.gradientBackgroundContainer}
			start={{ x: 1, y: 1 }}
			end={{ x: 0, y: 0 }}
		>
			<ImageBackground
				style={styles.innerBackgroundContainer}
				imageStyle={styles.imageBackground}
				resizeMode="stretch"
				source={{ uri: reservationBackgroundUri }}
			>
				<View style={styles.dataContainer}>
					<View style={styles.dataInnerContainer}>
						<Text style={styles.restaurantName}>{restaurantName}</Text>
						<Text style={styles.dates}>Reserved on: {formatedMadeOnDate}</Text>
						<Text style={styles.dates}>
							Reservation Date: {formatedReservationDate}
						</Text>
					</View>
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
										extraImages && extraImages[itemData.item.xShortFileName]
									}
								/>
							);
						}}
					/>
					<Text style={styles.displayedExtraName}>{displayedExtraName}</Text>
				</View>
			</ImageBackground>
		</LinearGradient>
	);
};

export default ReservationListItem;

const styles = StyleSheet.create({
	gradientBackgroundContainer: {
		padding: 3,
		justifyContent: "center",
		alignItems: "center",
		height: Dimensions.get("window").width * 0.65,
		margin: Dimensions.get("window").width * 0.03,
		borderRadius: 15,
		overflow: "hidden",
		elevation: 10,
		shadowColor: "#ffffff",
		shadowOpacity: 0.5,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 24,
	},
	innerBackgroundContainer: {
		flex: 1,
		width: "100%",
	},
	imageBackground: {
		opacity: 0.9,
		borderRadius: 12,
	},
	dataContainer: {
		flex: 0.7,
		justifyContent: "center",
		alignItems: "center",
	},
	dataInnerContainer: {
		flex: 0.6,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000060",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#ffffff",
	},
	restaurantName: {
		color: "#ffffff",
		fontSize: 24,
		fontWeight: "800",
	},
	dates: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "500",
	},
	extrasContainer: {
		flex: 0.4,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000060",
		borderTopWidth: 0.8,
		borderColor: "#ffffff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	extrasFlatList: {
		maxHeight: Dimensions.get("window").width * 0.16,
		borderBottomWidth: 1.5,
		borderColor: "#ffffff",
	},
	extrasFlatListContent: {},
	displayedExtraName: {
		color: "#ffffff",
		fontSize: 16,
		marginTop: 4,
		fontWeight: "500",
	},
});

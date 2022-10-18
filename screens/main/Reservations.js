import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ReservationListItem from "../reservations/ReservationListItem";
import { formatDate } from "../../util/dateFormat";
import { getReservations } from "../../util/storage";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase";

const Reservations = () => {
	const [reservationsData, setReservationsData] = useState([]);
	const [extraImages, setExtraImages] = useState({});

	const DUMMY_DATA = [
		{
			restaurantName: "Restaurant 1",
			restaurantUid: "40TlHHofjEfRZidkxCrr4vfi1Z52",
			filename: "11-10-2022 02:49:50 (889870563794587)",
			rsrvTimestamp: new Date().valueOf(),
			madeOnDate: formatDate(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7),
			table: {
				tSeats: 2,
				tShape: "Round",
			},
			extras: [
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
			],
			extrasTotalPrice: 25,
		},
		{
			restaurantName: "Restaurant 2",
			restaurantUid: "40TlHHofjEfRZidkxCrr4vfi1Z52",
			filename: "11-10-2022 02:49:50 (889870563794587)",
			rsrvTimestamp: new Date().valueOf(),
			madeOnDate: formatDate(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7),
			table: {
				tSeats: 2,
				tShape: "Round",
			},
			extras: [
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
			],
			extrasTotalPrice: 25,
		},
		{
			restaurantName: "Restaurant 3",
			restaurantUid: "40TlHHofjEfRZidkxCrr4vfi1Z52",
			filename: "11-10-2022 02:49:50 (889870563794587)",
			rsrvTimestamp: new Date().valueOf(),
			madeOnDate: formatDate(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7),
			table: {
				tSeats: 2,
				tShape: "Round",
			},
			extras: [
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
				{
					xName: "Candles",
					xImage: require("../../assets/imgs/candles.png"),
					xPrice: 1.99,
				},
				{
					xName: "Fresh Flowers Mix",
					xImage: require("../../assets/imgs/freshFlowersMix.png"),
					xPrice: 14.99,
				},
			],
			extrasTotalPrice: 25,
		},
	];

	useEffect(() => {
		async function getReservationsHandler() {
			const reservationsFetchedData = await getReservations();
			setReservationsData(reservationsFetchedData);

			const listRef = ref(storage, "extras");
			const response = await listAll(listRef);

			// Return, if the number of images inside state === number of all images under extras/ path
			if (extraImages.length === response.items.length) return;

			response.items.forEach(async (item) => {
				const extraImgRef = ref(storage, `extras/${item.name}`);
				const extraImgUri = await getDownloadURL(extraImgRef);

				setExtraImages((prev) => {
					const itemName = item.name.slice(0, -4);
					return {
						...prev,
						[`${itemName}`]: extraImgUri,
					};
				});
			});
		}
		getReservationsHandler();
		// console.log(extraImages);
		// console.log(reservationsData[0].extras[0]);
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={reservationsData}
				keyExtractor={(item, index) => index}
				// numColumns={2}
				renderItem={(itemData) => {
					return (
						<ReservationListItem
							restaurantName={itemData.item.restaurantName}
							reservationDateTimestamp={itemData.item.reservationDateTimestamp}
							madeOnDate={itemData.item.madeOnTimestamp}
							extras={itemData.item.extras}
							extraImages={extraImages}
						/>
					);
				}}
			/>
		</View>
	);
};

export default Reservations;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#311A1A",
	},
	text: {
		color: "#ffffff",
	},
});

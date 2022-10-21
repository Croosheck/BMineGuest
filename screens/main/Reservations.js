import { Animated, Easing, FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReservationListItem from "../reservations/ReservationListItem";
import { getReservations } from "../../util/storage";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase";
import { LinearGradient } from "expo-linear-gradient";
import LottieIcon from "../../components/LottieIcon";

const Reservations = ({ navigation }) => {
	const [reservationsData, setReservationsData] = useState([]);
	const [extraImages, setExtraImages] = useState({});

	const animationProgress = useRef(new Animated.Value(0.315));

	useLayoutEffect(() => {
		// Icon animation on click
		const unsubscribeFocus = navigation.addListener("focus", () => {
			navigation.setOptions({
				tabBarIcon: ({ color }) => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieReservations.json")}
							progress={animationProgress.current}
							height={55}
							transform={[{ translateY: -8 }, { translateX: 0 }]}
							colorFilters={
								[
									// {
									// 	//circle
									// 	keypath: "in-book",
									// 	color: "#FFFFFF",
									// },
									// {
									// 	//fork
									// 	keypath: "hover-book",
									// 	color: "#FF0000",
									// },
									// {
									// 	//knife
									// 	keypath: "Layer 10",
									// 	color: "#FF9696",
									// },
								]
							}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 1,
				duration: 900,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		});

		// Icon animation on screen change (back to default)
		const unsubscribeBlur = navigation.addListener("blur", () => {
			navigation.setOptions({
				tabBarIcon: () => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieReservations.json")}
							progress={animationProgress.current}
							height={55}
							transform={[{ translateY: -8 }, { translateX: 0 }]}
							colorFilters={
								[
									// {
									// 	//circle
									// 	keypath: "in-book",
									// 	color: "#FFFFFF",
									// },
									// {
									// 	//fork
									// 	keypath: "hover-book",
									// 	color: "#FF0000",
									// },
									// {
									// 	//knife
									// 	keypath: "Layer 10",
									// 	color: "#FF9696",
									// },
								]
							}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 0.28,
				duration: 700,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		});

		return () => {
			// Event listeners clearing
			unsubscribeFocus();
			unsubscribeBlur();
		};
	}, []);

	useEffect(() => {
		// Reservations fetch function - data and images
		async function getReservationsHandler() {
			// Get all the reservations data (without images)
			const reservationsFetchedData = await getReservations();
			setReservationsData(reservationsFetchedData);

			const listRef = ref(storage, "extras");

			// List all images from extras/ path
			const response = await listAll(listRef);

			// Return, if the number of images inside state object === number of all images under extras/ path
			// - prevents from overloading
			if (extraImages.length === response.items.length) return;

			// For each extra item (image) from Storage - get a url and connect with extras
			response.items.forEach(async (item) => {
				const extraImgRef = ref(storage, `extras/${item.name}`);
				const extraImgUri = await getDownloadURL(extraImgRef);

				setExtraImages((prev) => {
					// Cut the image extension (mostly .png's)
					const itemName = item.name.slice(0, -4);

					return {
						...prev,
						[itemName]: extraImgUri,
					};
				});
			});
		}

		getReservationsHandler();
	}, []);

	return (
		<LinearGradient
			style={styles.container}
			colors={["#3B1616", "#010C1C", "#370B0B"]}
		>
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
							restaurantUid={itemData.item.restaurantUid}
						/>
					);
				}}
			/>
		</LinearGradient>
	);
};

export default Reservations;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FF8181",
	},
	text: {
		color: "#ffffff",
	},
});

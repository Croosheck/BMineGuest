import {
	Animated,
	Easing,
	FlatList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReservationListItem from "../reservations/ReservationListItem";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { LinearGradient } from "expo-linear-gradient";
import LottieIcon from "../../components/LottieIcon";
import { SlideInRight, SlideInUp, ZoomInEasyUp } from "react-native-reanimated";
import { collection, onSnapshot, query } from "firebase/firestore";

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
		//////////////////////////////////////////////////////////
		/// Realtime ///
		const q = query(
			collection(db, "users", auth.currentUser.uid, "reservations")
		);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const reservations = [];
			querySnapshot.forEach((doc) => {
				reservations.push(doc.data());
			});
			setReservationsData(reservations);
		});
		//////////////////////////////////////////////////////////

		// Reservations fetch function - data and images
		async function getReservationsHandler() {
			const listRef = ref(storage, "extras");

			// List all images under the /extras/ path
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

	if (!reservationsData.length > 0) {
		return (
			<LinearGradient
				style={[styles.container, styles.emptyListLabel]}
				colors={["#3B1616", "#010C1C", "#370B0B"]}
			>
				<Text style={styles.emptyListLabel}>No active reservations yet.</Text>
			</LinearGradient>
		);
	}

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
					function getReservationStatusHandler() {
						if (!itemData.item.confirmed && !itemData.item.cancelled)
							return {
								status: "Pending",
								bgColor: "#79B4FDA6",
							};
						if (itemData.item.confirmed)
							return {
								status: "Confirmed",
								bgColor: "#FFFA66A6",
							};
						if (itemData.item.cancelled)
							return {
								status: "Cancelled",
								bgColor: "#FF5858A6",
							};
					}

					const reservationStatus = getReservationStatusHandler();

					return (
						<ReservationListItem
							restaurantName={itemData.item.restaurantName}
							reservationDateTimestamp={itemData.item.reservationDateTimestamp}
							madeOnDate={itemData.item.madeOnTimestamp}
							extras={itemData.item.extras}
							extraImages={extraImages}
							restaurantUid={itemData.item.restaurantUid}
							reservationEntering={ZoomInEasyUp.delay(500)
								.duration(1000)
								.springify()
								.mass(0.6)}
							extraEntering={SlideInUp.delay(800)
								.duration(1000)
								.springify()
								.mass(0.6)}
							reservationExiting={SlideInRight.duration(800)
								.springify()
								.mass(0.6)}
							statusColor={reservationStatus.bgColor}
							statusText={reservationStatus.status}
							statusTextColor="#ffffff"
							statusEntering={SlideInRight.delay(1600)
								.duration(500)
								.springify()
								.mass(0.65)}
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
	emptyListLabel: {
		justifyContent: "center",
		alignItems: "center",
		color: "#ffffff",
		fontSize: 20,
	},
});

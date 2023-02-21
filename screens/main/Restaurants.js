import { Animated, Easing, FlatList, StyleSheet } from "react-native";
import RestaurantListItem from "../restaurants/RestaurantListItem";

import { useDispatch, useSelector } from "react-redux";
import { getRestaurants } from "../../redux/slices/user";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import LottieIcon from "../../components/LottieIcon";
import {
	SlideInRight,
	SlideInUp,
	ZoomInEasyDown,
} from "react-native-reanimated";

import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";

const Restaurants = ({ navigation }) => {
	const [ratings, setRatings] = useState({});

	const dispatch = useDispatch();
	const { availableRestaurants } = useSelector((state) => state.userReducer);

	const animationProgress = useRef(new Animated.Value(0.12));

	useLayoutEffect(() => {
		// Icon animation on click
		const unsubscribeFocus = navigation.addListener("focus", () => {
			navigation.setOptions({
				tabBarIcon: ({ color }) => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieRestaurants.json")}
							progress={animationProgress.current}
							width={50}
							transform={[{ translateY: -7 }]}
							colorFilters={[
								{
									//circle
									keypath: "Layer 9",
									color: color,
								},
								{
									//fork
									keypath: "Layer 11",
									color: color,
								},
								{
									//knife
									keypath: "Layer 10",
									color: color,
								},
							]}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 0.6,
				duration: 1000,
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
							source={require("../../assets/lottie/lottieRestaurants.json")}
							progress={animationProgress.current}
							width={50}
							transform={[{ translateY: -7 }]}
							colorFilters={[
								{
									//circle
									keypath: "Layer 9",
									color: "#595959",
								},
								{
									//fork
									keypath: "Layer 11",
									color: "#FF9696",
								},
								{
									//knife
									keypath: "Layer 10",
									color: "#FF9696",
								},
							]}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 0.12,
				duration: 600,
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

	function pressHandler(itemData) {
		//temporary
		if (itemData.item.uid !== "XigLnIKHcWUXdHtHlcXnDLehMa83") return;

		navigation.navigate("RestaurantProfile", {
			name: itemData.item.name,
			description: itemData.item.description
				? itemData.item.description
				: "No description.",
			imageUri: itemData.item.imageUri,
			restaurantKey: itemData.item.key,
			restaurantUid: itemData.item.uid,
			reservationAdvance: itemData.item.reservationAdvance,
			openDays: itemData.item.openDays,
			reservationLimit: itemData.item.reservationLimit,
			reservationsEnabled: itemData.item.reservationsEnabled,
			restaurantTags: itemData.item.restaurantTags,
			phone: itemData.item.phone,
			rating: itemData.item.restaurantRating,
		});
	}

	useEffect(() => {
		const ratingsQuery = query(collection(db, "restaurantRatings"));

		const unsubscribeRatings = onSnapshot(ratingsQuery, (ratingsSnapshot) => {
			setRatings({});
			ratingsSnapshot.forEach((doc) => {
				setRatings((prev) => ({ ...prev, [doc.id]: doc.data() }));
			});
			// console.log(ratings["XigLnIKHcWUXdHtHlcXnDLehMa83"].ratings);
		});
	}, []);

	return (
		<LinearGradient
			style={styles.container}
			colors={["#1C0B49", "#010C1C", "#370B0B"]}
		>
			<FlatList
				data={availableRestaurants}
				renderItem={(itemData) => {
					return (
						<RestaurantListItem
							rating={{
								sum: ratings[itemData.item.uid]?.ratingsSum,
								total: ratings[itemData.item.uid]?.ratingsTotal,
							}}
							name={itemData.item.name}
							onPress={() => pressHandler(itemData)}
							restaurantUid={itemData.item.uid}
							restaurantEntering={ZoomInEasyDown.delay(500)
								.duration(1000)
								.springify()
								.mass(0.6)}
							titleEntering={SlideInUp.delay(1500).springify().mass(0.5)}
							restaurantNameEntering={SlideInRight.delay(2000)
								.springify()
								.mass(0.7)}
						/>
					);
				}}
			/>
		</LinearGradient>
	);
};

export default Restaurants;

const styles = StyleSheet.create({
	container: {},
});

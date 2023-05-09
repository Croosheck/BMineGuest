import { Animated, Easing, FlatList, StyleSheet } from "react-native";
import RestaurantListItem from "./restaurants/RestaurantListItem";
import { ratingBgColorHandler } from "./restaurants/utils/ratingBgColorHandler";

import { useDispatch, useSelector } from "react-redux";
import { getRestaurants } from "../../redux/slices/user";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import LottieIcon from "../../components/LottieIcon";
import {
	FadeInLeft,
	FadeInRight,
	SlideInLeft,
	SlideInRight,
	StretchInY,
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
			url: itemData.item.url || "",
			tables: itemData.item.tables || [],
			tablesFiltering: itemData.item.tablesFiltering,
		});
	}

	useEffect(() => {
		const ratingsQuery = query(collection(db, "restaurantRatings"));

		const unsubscribeRatings = onSnapshot(ratingsQuery, (ratingsSnapshot) => {
			setRatings({});
			ratingsSnapshot.forEach((doc) => {
				setRatings((prev) => ({ ...prev, [doc.id]: doc.data() }));
			});
		});

		return () => unsubscribeRatings();
	}, []);

	return (
		<LinearGradient
			style={styles.container}
			colors={["#1C0B49", "#010C1C", "#370B0B"]}
		>
			<FlatList
				data={availableRestaurants}
				keyExtractor={(item, idx) => item.uid}
				renderItem={(itemData) => {
					const rating = (
						ratings[itemData.item.uid]?.ratingsSum /
						ratings[itemData.item.uid]?.ratingsTotal
					).toFixed(1);

					const fadeInDirection =
						itemData.index % 2 === 0
							? FadeInLeft.delay(500).duration(1000).springify().mass(0.6)
							: FadeInRight.delay(500).duration(1000).springify().mass(0.6);

					const slideInDirection =
						itemData.index % 2 === 0
							? SlideInRight.delay(1200).springify().mass(0.6)
							: SlideInLeft.delay(1200).springify().mass(0.6);

					return (
						<RestaurantListItem
							rating={{
								sum: ratings[itemData.item.uid]?.ratingsSum,
								total: ratings[itemData.item.uid]?.ratingsTotal,
							}}
							name={itemData.item.name}
							onPress={() => pressHandler(itemData)}
							restaurantUid={itemData.item.uid}
							restaurantEntering={fadeInDirection}
							titleEntering={StretchInY.delay(1000).springify().mass(0.5)}
							restaurantNameEntering={slideInDirection}
							ratingStyle={ratingBgColorHandler(rating)}
						/>
					);
				}}
			/>
		</LinearGradient>
	);
};

export default Restaurants;

const styles = StyleSheet.create({
	container: {
		minHeight: "100%",
	},
});

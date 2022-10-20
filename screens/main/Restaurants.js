import { FlatList, StyleSheet, Text, View } from "react-native";
import RestaurantListItem from "../restaurants/RestaurantListItem";

import { useDispatch, useSelector } from "react-redux";
import { getRestaurants } from "../../redux/slices/user";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const Restaurants = ({ navigation }) => {
	const dispatch = useDispatch();
	const { availableRestaurants } = useSelector((state) => state.userReducer);

	useEffect(() => {
		dispatch(getRestaurants());
	}, []);

	function pressHandler(itemData) {
		navigation.navigate("RestaurantProfile", {
			name: itemData.item.name,
			description: itemData.item.description
				? itemData.item.description
				: "Test Description",
			imageUri: itemData.item.imageUri,
			restaurantKey: itemData.item.key,
			restaurantUid: itemData.item.uid,
		});
	}

	return (
		<LinearGradient
			style={styles.container}
			colors={["#1C0B49", "#010C1C", "#370B0B"]}
		>
			<FlatList
				data={availableRestaurants}
				// numColumns={2}
				renderItem={(itemData) => {
					return (
						<RestaurantListItem
							name={itemData.item.name}
							id={itemData.item.key}
							imageUri={itemData.item.imageUri}
							onPress={() => pressHandler(itemData)}
							restaurantUid={itemData.item.uid}
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
		flex: 1,
		backgroundColor: "#311A1A",
	},
});

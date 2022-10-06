import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Reservation from "../restaurants/Reservation";
import RestaurantListItem from "../restaurants/RestaurantListItem";

const Restaurants = ({ navigation }) => {
	const RESTAURANTS = [
		{
			name: "Restaurant 1",
			description: "Make Yourself like home!",
			key: 1,
			imageUri: require("../../assets/imgs/restaurant1.jpg"),
		},
		{
			name: "Restaurant 2",
			description: "Make Yourself like home!",
			key: 2,
			imageUri: require("../../assets/imgs/restaurant2.jpg"),
		},
		{
			name: "Restaurant 3",
			description: "Make Yourself like home!",
			key: 3,
			imageUri: require("../../assets/imgs/restaurant3.jpg"),
		},
		{
			name: "Restaurant 4",
			description: "Make Yourself like home!",
			key: 4,
			imageUri: require("../../assets/imgs/restaurant4.jpg"),
		},
		{
			name: "Restaurant 5",
			description: "Make Yourself like home!",
			key: 5,
			imageUri: require("../../assets/imgs/restaurant5.jpg"),
		},
		{
			name: "Restaurant 6",
			description: "Make Yourself like home!",
			key: 6,
			imageUri: require("../../assets/imgs/restaurant6.jpg"),
		},
		{
			name: "Restaurant 7",
			description: "Make Yourself like home!",
			key: 7,
			imageUri: require("../../assets/imgs/restaurant7.jpg"),
		},
		{
			name: "Restaurant 8",
			description: "Make Yourself like home!",
			key: 8,
			imageUri: require("../../assets/imgs/restaurant8.jpg"),
		},
	];

	function pressHandler(itemData) {
		// console.log(itemData.item.key);
		navigation.navigate("RestaurantProfile", {
			name: itemData.item.name,
			description: itemData.item.description,
			imageUri: itemData.item.imageUri,
		});
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={RESTAURANTS}
				// numColumns={2}
				renderItem={(itemData) => {
					return (
						<RestaurantListItem
							name={itemData.item.name}
							description={itemData.item.description}
							id={itemData.item.key}
							imageUri={itemData.item.imageUri}
							onPress={() => pressHandler(itemData)}
						/>
					);
				}}
			/>
		</View>
	);
};

export default Restaurants;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#311A1A",
	},
});

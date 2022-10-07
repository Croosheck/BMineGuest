import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import RestaurantListItem from "../restaurants/RestaurantListItem";

import { RESTAURANTS } from "../../util/restaurants";

const Restaurants = ({ navigation }) => {
	function pressHandler(itemData) {
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

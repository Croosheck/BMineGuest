import { FlatList, StyleSheet, Text, View } from "react-native";
import RestaurantListItem from "../restaurants/RestaurantListItem";

import { useSelector } from "react-redux";

const Restaurants = ({ navigation }) => {
	const { availableRestaurants } = useSelector((state) => state.userReducer);

	function pressHandler(itemData) {
		navigation.navigate("RestaurantProfile", {
			name: itemData.item.name,
			description: itemData.item.description,
			imageUri: itemData.item.imageUri,
			restaurantKey: itemData.item.key,
		});
	}

	return (
		<View style={styles.container}>
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

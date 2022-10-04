import { StyleSheet, Text, View } from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import Reservations from "./main/Reservations";
import Restaurants from "./main/Restaurants";
import Profile from "./main/Profile";

const Main = () => {
	const Tab = createMaterialBottomTabNavigator();

	return (
		<Tab.Navigator
			initialRouteName="Reservations"
			barStyle={{ backgroundColor: "#562323" }}
			labeled={false}
		>
			<Tab.Screen
				name="Reservations"
				component={Reservations}
				options={{
					tabBarIcon: ({ color }) => {
						return (
							<MaterialCommunityIcons
								name="book-check"
								color={color}
								size={26}
							/>
						);
					},
				}}
			/>
			<Tab.Screen
				name="Restaurants"
				component={Restaurants}
				options={{
					tabBarIcon: ({ color }) => {
						return <Ionicons name="restaurant" color={color} size={26} />;
					},
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarIcon: ({ color }) => {
						return <Ionicons name="person" color={color} size={26} />;
					},
				}}
			/>
		</Tab.Navigator>
	);
};

export default Main;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

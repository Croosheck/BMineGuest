import { StyleSheet } from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Reservations from "./main/Reservations";
import Restaurants from "./main/Restaurants";
import Profile from "./main/Profile";
import LottieIcon from "../components/LottieIcon";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getRestaurants, realTimeRestaurants } from "../redux/slices/user";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import FirestoreListener from "../components/FirestoreListener";

const Main = () => {
	const Tab = createMaterialBottomTabNavigator();
	const dispatch = useDispatch();

	let availableRestaurants;

	useEffect(() => {
		//Realtime
		// const q = query(collection(db, "restaurants"));
		// const unsubscribe = onSnapshot(q, (querySnapshot) => {
		// 	availableRestaurants = [];
		// 	querySnapshot.forEach((doc) => {
		// 		availableRestaurants.push(doc.data());
		// 	});
		// 	dispatch(realTimeRestaurants(availableRestaurants));
		// });
		//////////////////////////
		// Every refresh
		dispatch(getRestaurants());
	}, []);

	return (
		<>
			<Tab.Navigator
				initialRouteName="Reservations"
				barStyle={{ backgroundColor: "#562323" }}
				// labeled={false}
				shifting={true}
			>
				<Tab.Screen
					name="Reservations"
					component={Reservations}
					options={{
						tabBarIcon: ({ color }) => {
							return (
								<LottieIcon
									source={require("../assets/lottie/lottieReservations.json")}
									progress={0.315}
									height={55}
									transform={[{ translateY: -8 }, { translateX: 0 }]}
								/>
							);
						},
						tabBarColor: "#310D28",
						presentation: "modal",
						transitionSpec: {
							open: { animation: "timing" },
							close: { animation: "timing" },
						},
					}}
				/>
				<Tab.Screen
					name="Restaurants"
					component={Restaurants}
					options={{
						tabBarIcon: () => {
							return (
								<LottieIcon
									source={require("../assets/lottie/lottieRestaurants.json")}
									progress={0.12}
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
						tabBarColor: "#471313",
					}}
				/>
				<Tab.Screen
					name="Profile"
					component={Profile}
					options={{
						tabBarIcon: ({ color }) => {
							return (
								<LottieIcon
									source={require("../assets/lottie/lottieProfile.json")}
									width={50}
									transform={[{ translateY: -4 }]}
									colorFilters={[
										{
											//animated outline
											keypath: "User Outlines 2",
											color: "#9288FF",
										},
										{
											//outline
											keypath: "User Outlines",
											color: "#595959",
										},
									]}
								/>
							);
						},
						tabBarColor: "#292929",
					}}
				/>
			</Tab.Navigator>
		</>
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

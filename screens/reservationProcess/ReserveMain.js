import { Alert, Pressable, Text } from "react-native";
import LoadingScreen from "../../components/LoadingScreen";

import Date from "./Date";
import Tables from "./Tables";
import Extras from "./Extras";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useLayoutEffect } from "react";
import ImageIcon from "../../components/ImageIcon";
import { useDispatch, useSelector } from "react-redux";
import { clearDate, clearReservationData } from "../../redux/slices/user";

const ReserveMain = ({ navigation, route }) => {
	const TopTab = createMaterialTopTabNavigator();
	const dispatch = useDispatch();

	const {
		restaurantKey,
		name,
		restaurantUid,
		reservationAdvance,
		openDays,
		howMany,
		reservationsEnabled,
	} = route.params;

	const { reservationDate } = useSelector((state) => state.userReducer);
	const { table } = useSelector((state) => state.userReducer.reservationData);

	function summaryPreventionHandler() {
		// No date picked prevention
		if (!reservationDate) {
			Alert.alert(
				"Not everything is done yet.",
				"We would love to know, what day You wish to visit us!",
				[
					{
						text: "Let's go!",
						onPress: () => {
							navigation.navigate("Date");
						},
					},
				]
			);
			return;
		}

		// No table picked prevention
		if (Object.keys(table).length === 0) {
			Alert.alert(
				"Not everything is done yet.",
				"We have plenty of tables, You can pick out of from!",
				[
					{
						text: "Let's go!",
						onPress: () => {
							navigation.navigate("Tables");
						},
					},
				]
			);
			return;
		}
	}

	useEffect(() => {
		// Resets all tabs before leaving
		const unsubscribe = navigation.addListener("beforeRemove", () => {
			dispatch(clearReservationData(restaurantKey));
			dispatch(clearDate());
		});

		return () => {
			unsubscribe();
		};
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable
					style={({ pressed }) => [
						{
							color: "#ffffff",
							marginRight: 8,
							borderWidth: 2,
							borderColor: "#ffffff",
							borderRadius: 18,
							paddingHorizontal: 8,
							paddingVertical: 4,
						},
						pressed && { opacity: 0.5 },
					]}
					onPress={() => {
						if (Object.keys(table).length === 0 || !reservationDate) {
							summaryPreventionHandler();
							return;
						}

						navigation.navigate("Summary", {
							restaurantKey: restaurantKey,
							name: name,
							restaurantUid: restaurantUid,
							howMany: howMany,
						});
					}}
				>
					<Text style={{ color: "#ffffff" }}>Summary</Text>
				</Pressable>
			),
		});
	});

	return (
		<TopTab.Navigator
			initialRouteName="Date"
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: { backgroundColor: "#000A2B" },
				// tabBarLabelStyle: { fontWeight: "600" },
				tabBarActiveTintColor: "#ffffff",
				tabBarPressColor: "transparent",
				tabBarBounces: true,
				// lazy: true,
				// lazyPlaceholder: () => <LoadingScreen />,

				// for older OS
				tabBarPressOpacity: 0.5,
			}}
		>
			<TopTab.Screen
				name="Date"
				component={Date}
				initialParams={{
					restaurantKey: restaurantKey,
					reservationAdvance: reservationAdvance,
					openDays: openDays,
					reservationsEnabled: reservationsEnabled,
				}}
				options={{
					tabBarIcon: () => {
						return (
							<ImageIcon source={require("../../assets/icons/date.png")} />
						);
					},
				}}
			/>
			<TopTab.Screen
				name="Tables"
				component={Tables}
				initialParams={{
					restaurantKey: restaurantKey,
					howMany: howMany,
				}}
				options={{
					tabBarIcon: () => {
						return (
							<ImageIcon source={require("../../assets/icons/table.png")} />
						);
					},
				}}
			/>
			<TopTab.Screen
				name="Extras"
				component={Extras}
				initialParams={{
					restaurantKey: restaurantKey,
				}}
				options={{
					tabBarIcon: () => {
						return (
							<ImageIcon source={require("../../assets/icons/extra.png")} />
						);
					},
				}}
			/>
		</TopTab.Navigator>
	);
};

export default ReserveMain;

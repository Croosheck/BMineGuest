import {
	Dimensions,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import LoadingScreen from "../../components/LoadingScreen";

import Date from "./Date";
import Tables from "./Tables";
import Extras from "./Extras";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useLayoutEffect } from "react";
import ImageIcon from "../../components/ImageIcon";

const ReserveMain = ({ navigation }) => {
	const TopTab = createMaterialTopTabNavigator();

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
						console.log("Pressed");
						navigation.navigate("Summary");
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
				tabBarStyle: { backgroundColor: "#000000" },
				tabBarLabelStyle: { fontWeight: "600" },
				tabBarActiveTintColor: "#ffffff",
				tabBarInactiveTintColor: "#311A1A",
				tabBarPressColor: "#00107B00",
				tabBarBounces: true,
				lazy: true,
				lazyPlaceholder: () => <LoadingScreen />,

				// for older OS
				tabBarPressOpacity: 0,

				// tabBarShowLabel: false,
				// tabBarIcon: ({ focused, color }) => <Text>X</Text>,
			}}
		>
			<TopTab.Screen
				name="Date"
				component={Date}
				options={{
					tabBarShowLabel: false,
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
				options={{
					tabBarShowLabel: false,
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
				options={{
					tabBarShowLabel: false,
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#311A1A",
		padding: 8,
	},
	text: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		marginVertical: Dimensions.get("window").height * 0.02,
	},
});

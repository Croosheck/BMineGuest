import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import Landing from "./screens/auth/Landing";
import Register from "./screens/auth/Register";
import Login from "./screens/auth/Login";
import Main from "./screens/Main";

import RestaurantProfile from "./screens/restaurants/RestaurantProfile";
import ReserveMain from "./screens/reservationProcess/ReserveMain";
import Summary from "./screens/reservationProcess/Summary";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { getAuth } from "firebase/auth";

function AppContainer() {
	const Stack = createStackNavigator();

	const [isLoggedIn, setIsLoggedIn] = useState({
		loaded: false,
		loggedIn: null,
	});

	useEffect(() => {
		getAuth().onAuthStateChanged((user) => {
			if (!user) {
				setIsLoggedIn({ loaded: true, loggedIn: false });
			} else {
				setIsLoggedIn({ loaded: true, loggedIn: true });
			}
		});
	}, []);

	const { loaded, loggedIn } = isLoggedIn;

	if (!loaded) {
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (!loggedIn) {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Landing">
					<Stack.Screen
						name="Landing"
						component={Landing}
						options={{
							headerShown: false,
							presentation: "modal",
							transitionSpec: {
								open: { animation: "timing" },
								close: { animation: "timing" },
							},
						}}
					/>
					<Stack.Screen
						name="Register"
						component={Register}
						options={{
							headerShown: false,
							presentation: "modal",
						}}
					/>
					<Stack.Screen
						name="Login"
						component={Login}
						options={{
							headerShown: false,
							presentation: "modal",
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Main">
				<Stack.Screen
					name="Main"
					component={Main}
					options={{
						headerShown: false,
						transitionSpec: {
							open: { animation: "timing" },
							close: { animation: "timing" },
						},
					}}
				/>
				<Stack.Screen
					name="RestaurantProfile"
					component={RestaurantProfile}
					options={{
						headerShown: false,
						presentation: "transparentModal",
					}}
				/>
				<Stack.Screen
					name="ReserveMain"
					component={ReserveMain}
					options={{
						headerTitle: "Reservation Options",
						headerStyle: {
							backgroundColor: "#330A0A",
							borderColor: "#ffffff",
							borderBottomWidth: 0.5,
						},
						headerTintColor: "#ffffff",
						presentation: "transparentModal",
					}}
				/>
				<Stack.Screen
					name="Summary"
					component={Summary}
					options={{
						headerStyle: {
							backgroundColor: "#330A0A",
							borderColor: "#ffffff",
							borderBottomWidth: 0.5,
						},
						headerTintColor: "#ffffff",
						presentation: "transparentModal",
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<Provider store={store}>
			<StatusBar translucent={false} style="light" />
			<View style={{ flex: 1, backgroundColor: "#000000" }}>
				<AppContainer />
			</View>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

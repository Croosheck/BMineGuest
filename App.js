import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import Landing from "./screens/auth/Landing";
import Register from "./screens/auth/Register";
import Login from "./screens/auth/Login";

import Main from "./screens/Main";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { getAuth } from "firebase/auth";
import RestaurantProfile from "./screens/restaurants/RestaurantProfile";
import ReserveMain from "./screens/reservationProcess/ReserveMain";
import Summary from "./screens/reservationProcess/Summary";

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
						}}
					/>
					<Stack.Screen
						name="Register"
						component={Register}
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="Login"
						component={Login}
						options={{
							headerShown: false,
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
					}}
				/>
				<Stack.Screen
					name="RestaurantProfile"
					component={RestaurantProfile}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="ReserveMain"
					component={ReserveMain}
					options={{
						// headerShown: false,
						headerTitle: "Reservation Options",
						headerStyle: {
							backgroundColor: "#330A0A",
							// borderColor: "#ffffff",
							// borderBottomWidth: 2,
						},
						headerTintColor: "#ffffff",
					}}
				/>
				<Stack.Screen
					name="Summary"
					component={Summary}
					options={{
						// headerShown: false,
						headerStyle: {
							backgroundColor: "#330A0A",
							// borderColor: "#ffffff",
							// borderBottomWidth: 2,
						},
						headerTintColor: "#ffffff",
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
			<AppContainer />
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

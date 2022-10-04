import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Landing from "./screens/auth/Landing";
import Register from "./screens/auth/Register";
import Login from "./screens/auth/Login";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import { getAuth } from "firebase/auth";

export default function App() {
	const Stack = createStackNavigator();

	// const [isLoggedIn, setIsLoggedIn] = useState({
	// 	loaded: false,
	// 	loggedIn: null,
	// });

	// useEffect(() => {
	// 	getAuth().onAuthStateChanged((user) => {
	// 		if (!user) {
	// 			setIsLoggedIn({ loaded: true, loggedIn: false });
	// 		} else {
	// 			setIsLoggedIn({ loaded: true, loggedIn: true });
	// 		}
	// 	});
	// }, []);

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

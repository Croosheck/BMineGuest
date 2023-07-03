import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import Landing from "./screens/auth/Landing";
import Register from "./screens/auth/Register";
import Login from "./screens/auth/Login";
import Main from "./screens/Main";

import RestaurantProfile from "./screens/main/restaurants/RestaurantProfile";
import ReserveMain from "./screens/reservationProcess/ReserveMain";
import Summary from "./screens/reservationProcess/Summary";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { getAuth } from "firebase/auth";
import LoadingSplashScreen from "./screens/LoadingSplashScreen";

function AppContainer() {
	const Stack = createStackNavigator();

	const [isLoggedIn, setIsLoggedIn] = useState({
		loaded: false,
		loggedIn: null,
	});
	const [areCredentialsValid, setAreCredentialsValid] = useState(false);

	const { loaded, loggedIn } = isLoggedIn;

	//used when user is already logged in and turns the app back on
	let isFreshStart = true;

	function onLoginHandler(duration, isFreshStart) {
		if (isFreshStart) {
			setIsLoggedIn({ loaded: true, loggedIn: true });
			return;
		}

		setTimeout(() => {
			setIsLoggedIn({ loaded: true, loggedIn: true });
		}, duration);
	}

	function onRegisterHandler() {
		setIsLoggedIn({ loaded: true, loggedIn: true });
	}

	useEffect(() => {
		getAuth().onAuthStateChanged((user) => {
			if (!user) {
				setIsLoggedIn({ loaded: true, loggedIn: false });
				setAreCredentialsValid(false);
				isFreshStart = false;
			}
			if (user) {
				//acivates a lottie animation and logs the user
				setAreCredentialsValid(true);
			}
			if (isFreshStart && user) {
				onLoginHandler(null, isFreshStart);
			}
		});
	}, []);

	if (!loaded) {
		return <LoadingSplashScreen theme="dark" label="Loading app..." />;
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
						options={{
							headerShown: false,
							presentation: "modal",
						}}
					>
						{() => <Register onRegister={onRegisterHandler} />}
					</Stack.Screen>
					<Stack.Screen
						name="Login"
						options={{
							headerShown: false,
							presentation: "modal",
						}}
					>
						{() => (
							<Login
								areCredentialsValid={areCredentialsValid}
								onLogin={onLoginHandler}
							/>
						)}
					</Stack.Screen>
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
							// borderBottomWidth: 0.5,
						},
						headerTintColor: "#ffffff",
						presentation: "modal",
						transitionSpec: {
							open: { animation: "timing" },
							close: { animation: "timing" },
						},
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default function App() {
	const statusBarHidden = Platform.select({ ios: false, android: false });

	return (
		<Provider store={store}>
			<StatusBar
				translucent={false}
				barStyle="light-content"
				backgroundColor="#000000"
				hidden={statusBarHidden}
			/>
			<AppContainer />
		</Provider>
	);
}

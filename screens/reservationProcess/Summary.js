import { useEffect, useLayoutEffect, useState } from "react";
import {
	Dimensions,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { formatDate } from "../../util/dateFormat";
import uploadData from "../../util/storage";

const Summary = ({ navigation, route }) => {
	const [displayTime, setDisplayTime] = useState();

	const { table, extras } = useSelector(
		(state) => state.userReducer.reservationData
	);
	const { reservationDate, currentUser } = useSelector(
		(state) => state.userReducer
	);

	const { name, restaurantKey, restaurantUid, howMany } = route.params;

	const extrasPrice = extras
		.reduce((acc, item) => {
			return acc + item.xPrice;
		}, 0)
		.toFixed(2);

	useLayoutEffect(() => {
		const data = {
			restaurantName: name,
			restaurantKey: restaurantKey,
			restaurantUid: restaurantUid,
			reservationDate: formatDate(reservationDate),
			reservationDateTimestamp: reservationDate,
			table: table,
			extras: extras,
			extrasTotalPrice: extrasPrice,
			clientsName: currentUser.name,
			clientsEmail: currentUser.email,
			clientsUid: auth.currentUser.uid,
			howMany: howMany,
		};

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
						uploadData(null, null, data);
					}}
				>
					<Text style={{ color: "#ffffff" }}>All Done!</Text>
				</Pressable>
			),
		});
	});

	useEffect(() => {
		if (!reservationDate) return;
		setDisplayTime(formatDate(reservationDate));
	}, [reservationDate]);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{displayTime}</Text>
			{table && <Text style={styles.text}>Placement: {table.tPlacement}</Text>}
			{table && <Text style={styles.text}>Seats: {table.tSeats}</Text>}
			{table && <Text style={styles.text}>ID: {table.tId}</Text>}
			{extras && (
				<ScrollView>
					<View style={{ flexDirection: "column" }}>
						{extras.map((item) => {
							return (
								<Text
									key={Math.random() * 1000000}
									style={{ color: "#ffffff" }}
								>
									- {item.xName}
								</Text>
							);
						})}
					</View>
					{extras && (
						<Text style={styles.text}>Extras total price: {extrasPrice}</Text>
					)}
				</ScrollView>
			)}
		</View>
	);
};

export default Summary;

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

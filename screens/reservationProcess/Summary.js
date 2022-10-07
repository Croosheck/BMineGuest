import { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { formatDate } from "../../util/dateFormat";

const Summary = ({ navigation }) => {
	const [displayTime, setDisplayTime] = useState();

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
						// navigation.navigate();
					}}
				>
					<Text style={{ color: "#ffffff" }}>All Done!</Text>
				</Pressable>
			),
		});
	});

	const { table, extras } = useSelector(
		(state) => state.userReducer.reservationData
	);
	const { reservationDate } = useSelector((state) => state.userReducer);

	useEffect(() => {
		if (!reservationDate) return;
		setDisplayTime(formatDate(reservationDate));
	}, [reservationDate]);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{displayTime}</Text>
			{table && <Text style={styles.text}>{table}</Text>}
			{extras && <Text style={styles.text}>{extras}</Text>}
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

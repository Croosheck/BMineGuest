import { useLayoutEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { formatDate } from "../../util/formatDate";
import uploadData from "../../util/storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../components/Icon";
import { clearDate, clearReservationData } from "../../redux/slices/user";
import HeaderRightButton from "../../components/HeaderRightButton";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

const MESSAGE_MAX_LENGTH = 150;

const Summary = ({ navigation, route }) => {
	const [displayTime, setDisplayTime] = useState();
	const [message, setMessage] = useState({
		content: "",
		length: 0,
	});

	const { table, extras } = useSelector(
		(state) => state.userReducer.reservationData
	);
	const { reservationDate, currentUser, reservationDateParameters } =
		useSelector((state) => state.userReducer);

	const { name, restaurantKey, restaurantUid, howMany, phone, url } =
		route.params;

	const dispatch = useDispatch();

	const extrasPrice = extras
		.reduce((acc, item) => {
			return acc + item.xPrice;
		}, 0)
		.toFixed(2);

	useLayoutEffect(() => {
		setDisplayTime(formatDate(reservationDate));

		const data = {
			restaurantName: name,
			restaurantKey: restaurantKey,
			restaurantUid: restaurantUid,
			reservationDate: formatDate(reservationDate),
			reservationDateTimestamp: reservationDate,
			reservationDateParameters: reservationDateParameters,
			table: table,
			extras: extras,
			extrasTotalPrice: extrasPrice,
			clientsName: currentUser.name,
			clientsEmail: currentUser.email,
			clientsUid: auth.currentUser.uid,
			howMany: howMany,
			phone: phone,
			url: url,
			note: message.content || "",
		};

		navigation.setOptions({
			headerRight: () => (
				<HeaderRightButton
					onPress={() => {
						uploadData(null, null, data);
						navigation.navigate("Reservations");
						dispatch(clearReservationData(restaurantKey));
						dispatch(clearDate());
					}}
					title="Submit now!"
					backgroundColor="#A1A65D"
				/>
			),
		});
	});

	const seatIcon = (
		<Icon name="seat" size={20} color="#ffffff" style={styles.seatsIcon} />
	);

	return (
		<LinearGradient
			style={styles.container}
			colors={["#1C1616", "#463434"]}
			start={{ x: 0, y: 0.7 }}
			end={{ x: 0.7, y: 0 }}
		>
			<View style={styles.restaurantNameContainer}>
				<Text style={[styles.restaurantName, styles.textShadow]}>{name}</Text>
			</View>

			<View style={styles.tableImageContainer}>
				<Image
					style={styles.tableImage}
					source={{ uri: table.tImage }}
					resizeMode="cover"
				/>
			</View>

			<View style={styles.tableDetailsContainer}>
				<Text style={[styles.tableDetail, styles.textShadow]}>
					{table.tPlacement}
				</Text>
				<Text style={[styles.tableDetail, styles.textShadow]}>
					{seatIcon} {table.tSeats}
				</Text>
			</View>

			<View style={styles.messageContainer}>
				<TextInput
					style={styles.messageInput}
					multiline
					placeholder="Message... (optional)"
					maxLength={MESSAGE_MAX_LENGTH}
					onChangeText={(value) => {
						setMessage({ content: value, length: value.length });
					}}
					value={message.content}
				/>
				<Text
					style={styles.messageInputLimit}
				>{`${message.length}/${MESSAGE_MAX_LENGTH}`}</Text>
			</View>

			<View style={styles.detailsContainer}>
				<Text
					style={[styles.detailsReservation, styles.textShadow]}
				>{`Reservation for ${howMany}, on:\n${displayTime}`}</Text>
			</View>

			{extras && (
				<ScrollView
					horizontal
					style={styles.extrasScrollContainer}
					contentContainerStyle={styles.extrasScrollContent}
				>
					{extras.map((item, i) => {
						return (
							<View style={styles.extraItemContainer} key={i}>
								<Image
									style={styles.extraImage}
									source={{ uri: item.xImage }}
								/>
								<Text style={[styles.extraName, styles.textShadow]}>
									{item.xName}
								</Text>
							</View>
						);
					})}
				</ScrollView>
			)}

			<View style={styles.extrasTotalContainer}>
				<Text style={[styles.extrasTotalText, styles.textShadow]}>
					Extras total price: {extras ? extrasPrice : 0}
				</Text>
			</View>
		</LinearGradient>
	);
};

export default Summary;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	textShadow: {
		textShadowColor: "#FFFFFF4C",
		textShadowOffset: { height: 2, width: 2 },
		textShadowRadius: 2,
	},
	//////////////////////////
	restaurantNameContainer: {
		backgroundColor: "#372020",
		width: WIDTH,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#FFFFFF7E",
		justifyContent: "center",
		maxHeight: HEIGHT * 0.07,
	},
	restaurantName: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 24,
		// textAlign: "center",
		marginLeft: 10,
	},
	//////////////////////////
	tableImageContainer: {
		flex: 1.5,
		width: WIDTH,
		maxHeight: HEIGHT * 0.5,
	},
	tableImage: {
		flexGrow: 1,
		width: "100%",
	},
	//////////////////////////
	tableDetailsContainer: {
		width: WIDTH,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "#FFFFFF4D",
		paddingVertical: 4,
	},
	tableDetail: {
		width: WIDTH * 0.5,
		color: "#ffffff",
		textAlign: "center",
		fontSize: 18,
		fontWeight: "300",
	},
	//////////////////////////
	messageContainer: {
		// borderWidth: 2,
		// borderColor: "#ffffff",

		width: "90%",
		marginTop: 20,
		paddingBottom: 20,
		borderRadius: 10,
		overflow: "hidden",
		padding: 5,
		minHeight: 40,
		maxHeight: 80,
		backgroundColor: "#ffffff",
	},
	messageInput: {
		fontSize: 18,
	},
	messageInputLimit: {
		position: "absolute",
		bottom: 0,
		right: 0,
		color: "#ffffff",
		backgroundColor: "#646464",
		borderTopLeftRadius: 10,
		paddingHorizontal: 7,
		paddingVertical: 2,
		lineHeight: 16,
		letterSpacing: 0.5,
		textAlign: "center",
	},
	//////////////////////////
	detailsContainer: {
		flex: 0.4,
		width: WIDTH,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "#cccccc",
	},
	detailsReservation: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
	},
	//////////////////////////
	extrasScrollContainer: {
		flex: 0.1,
		maxHeight: HEIGHT * 0.1,
		marginVertical: 20,
	},
	extrasScrollContent: {
		// backgroundColor: "#cccccc",
		justifyContent: "center",
		alignItems: "center",
	},
	extraItemContainer: {
		// backgroundColor: "#cccccc",
		marginHorizontal: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	extraImage: {
		height: "70%",
		aspectRatio: 1,
	},
	extraName: {
		color: "#ffffff",
		fontSize: 12,
		marginTop: 2,
	},
	//////////////////////////
	extrasTotalContainer: {
		width: WIDTH,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "#FFFFFF6B",
	},
	extrasTotalText: {
		width: WIDTH * 0.8,
		paddingVertical: 2,
		textAlign: "center",
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
		borderTopColor: "#FFFFFF6B",
		borderTopWidth: 0.8,
	},
});

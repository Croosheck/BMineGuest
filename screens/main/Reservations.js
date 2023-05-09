import {
	Alert,
	Animated,
	Dimensions,
	Easing,
	FlatList,
	StyleSheet,
	Text,
} from "react-native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReservationListItem from "./reservations/ReservationListItem";
import { auth, db } from "../../firebase";
import { LinearGradient } from "expo-linear-gradient";
import LottieIcon from "../../components/LottieIcon";
import { FadeIn, FadeInRight, FadeInUp } from "react-native-reanimated";
import { collection, onSnapshot, query } from "firebase/firestore";
import ReservationsFilters from "../../components/ReservationsFilters";
import OutlinedButton from "../../components/OutlinedButton";
import { drawerOptionsType } from "./reservations/drawer/drawerOptionsType";
import { addEvent } from "../../components/AddEvent";
import { mapsRedirect } from "../../util/mapsRedirect";
import { callingRedirect } from "../../util/callingRedirect";
import {
	cancellationRequest,
	deleteUserReservation,
	getExtras,
	updateRestaurantRating,
	updateUsersRatingStatus,
} from "../../util/storage";
import RatingModal from "./reservations/ratingModal/RatingModal";
import RequestModal from "./reservations/requestModal/RequestModal";
import { getReservationStatus } from "./reservations/utils/getReservationStatus";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

const Reservations = ({ navigation }) => {
	const [reservationsData, setReservationsData] = useState([]);
	const [extraImages, setExtraImages] = useState({});
	const [loaded, setLoaded] = useState(false);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [filterType, setFilterType] = useState("upcoming");
	const [emptyListMessage, setEmptyListMessage] = useState(
		`No ${filterType} reservations yet.`
	);
	const [ratingModalOpened, setRatingModalOpened] = useState({
		isOpened: false,
		reservationData: {},
	});
	const [rating, setRating] = useState({
		rating: 3,
		submitted: false,
	});
	const [requestModalOpened, setRequestModalOpened] = useState({
		isOpened: false,
		reservationData: {},
	});

	// Default state for bottom navbar icons
	const animationProgress = useRef(new Animated.Value(0.315));

	useLayoutEffect(() => {
		// Icon animation on click
		const unsubscribeFocus = navigation.addListener("focus", () => {
			navigation.setOptions({
				tabBarIcon: ({ color }) => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieReservations.json")}
							progress={animationProgress.current}
							height={55}
							transform={[{ translateY: -8 }, { translateX: 0 }]}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 1,
				duration: 900,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		});

		// Icon animation on screen change (back to default)
		const unsubscribeBlur = navigation.addListener("blur", () => {
			navigation.setOptions({
				tabBarIcon: () => {
					return (
						<LottieIcon
							source={require("../../assets/lottie/lottieReservations.json")}
							progress={animationProgress.current}
							height={55}
							transform={[{ translateY: -8 }, { translateX: 0 }]}
						/>
					);
				},
			});

			Animated.timing(animationProgress.current, {
				toValue: 0.28,
				duration: 700,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		});

		return () => {
			// Event listeners cleaning
			unsubscribeFocus();
			unsubscribeBlur();
		};
	}, []);

	useEffect(() => {
		if (auth.currentUser) {
			// Check if user is signed in before using currentUser.uid
			const q = query(
				collection(db, "users", auth.currentUser.uid, "reservations")
			);
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				if (querySnapshot.size === 0) {
					setLoaded(true);
				} else {
					const reservations = [];
					querySnapshot.forEach((doc) => {
						reservations.push(doc.data());
					});
					setReservationsData(reservations);
					setLoaded(true);
				}
			});

			getExtras({
				stateCallback: setExtraImages,
				state: extraImages,
			});
		}
	}, []);

	function filterButtonHandler(type) {
		//Anim-reservations only for the 1st render
		setIsFirstLoad(false);

		setFilterType(type);
		if (type === "upcoming" || type === "expired")
			setEmptyListMessage(`No ${type} reservations yet.`);
	}

	let listCounter;
	let drawerType;

	function ratingModalButtonHandler(itemData) {
		setRatingModalOpened({ isOpened: true, reservationData: itemData.item });
	}

	function noReservationsOutlinedButtonHandler() {
		navigation.navigate("Restaurants");
	}

	if (!loaded) {
		return (
			<LinearGradient
				style={[styles.container, styles.emptyListInnerContainer]}
				colors={["#3B1616", "#010C1C", "#370B0B"]}
			>
				<Text style={styles.emptyListLabel}>Loading...</Text>
			</LinearGradient>
		);
	}

	if (reservationsData.length === 0 && loaded) {
		return (
			<LinearGradient
				style={[styles.container, styles.emptyListInnerContainer]}
				colors={["#3B1616", "#010C1C", "#370B0B"]}
			>
				<LinearGradient
					colors={["#A8181846", "#0A163E82"]}
					style={styles.filteredListEmptyContainer}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 0.8, y: 1 }}
				>
					<Text style={styles.filteredListEmptyText}>
						{`No submitted reservations yet.\nDo you wish to look for something?\n`}
					</Text>
					<OutlinedButton
						title="Let's go!"
						style={styles.emptyListButton}
						innerStyle={styles.emptyListButtonInner}
						onPress={noReservationsOutlinedButtonHandler}
					/>
				</LinearGradient>
			</LinearGradient>
		);
	}

	return (
		<>
			<RatingModal
				visible={ratingModalOpened.isOpened}
				onCloseModal={() => {
					setRatingModalOpened((prev) => ({
						isOpened: !prev.isOpened,
						reservationData: {},
					}));
					setRating({
						rating: 3,
						submitted: false,
					});
				}}
				restaurantName={ratingModalOpened.reservationData?.restaurantName}
				rating={rating.rating}
				onChangeRating={(number) => setRating({ rating: number })}
				onSubmit={() => {
					setRating((prev) => ({ rating: prev.rating, submitted: true }));

					//saves rating for a particular reservation in database
					//and disables the rating button

					// updateUsersRatingStatus(
					// 	ratingModalOpened.reservationData.filename,
					// 	rating.rating
					// );

					//saves rating for a particular restaurant in database
					updateRestaurantRating(
						ratingModalOpened.reservationData?.restaurantUid,
						rating.rating,
						ratingModalOpened.reservationData?.filename
					);
				}}
				submitted={rating.submitted}
			/>

			<RequestModal
				visible={requestModalOpened.isOpened}
				onCloseModal={() =>
					setRequestModalOpened({ isOpened: false, reservationData: {} })
				}
				onSubmit={({ requestMessage, request }) => {
					cancellationRequest(
						requestModalOpened.reservationData,
						{
							requestType: request,
							requestMessage: requestMessage,
						},
						() =>
							callingRedirect({
								phoneNumber: requestModalOpened.reservationData.phone,
							})
					);

					setRequestModalOpened({ isOpened: false, reservationData: {} });
				}}
			/>

			<LinearGradient
				style={styles.container}
				colors={["#3B1616", "#010C1C", "#370B0B"]}
			>
				<ReservationsFilters
					left={{
						onPress: () => filterButtonHandler("all"),
						title: "All",
						active: filterType === "all",
					}}
					middle={{
						onPress: () => filterButtonHandler("upcoming"),
						title: "Upcoming",
						active: filterType === "upcoming",
					}}
					right={{
						onPress: () => filterButtonHandler("expired"),
						title: "Expired",
						active: filterType === "expired",
					}}
				/>

				<FlatList
					data={reservationsData}
					extraData={filterType}
					keyExtractor={(item, index) => `${item.filename}-${index}`}
					renderItem={(itemData) => {
						//reset for the 1st item
						if (itemData.index === 0) {
							listCounter = 0;
						}

						const reservationStatus = getReservationStatus(itemData);
						const currentTimestamp = Date.now();

						if (
							//check if the list is empty, upon filtering
							((filterType === "upcoming" &&
								!(itemData.item.reservationDateTimestamp > currentTimestamp)) ||
								(filterType === "expired" &&
									!(
										itemData.item.reservationDateTimestamp < currentTimestamp
									))) &&
							//also check if that's the last item
							itemData.index === reservationsData.length - 1 &&
							//also check if there weren't any items after filtering
							listCounter === 0
						)
							return (
								<LinearGradient
									colors={["#A8181846", "#0A163E82"]}
									style={styles.filteredListEmptyContainer}
									start={{ x: 0, y: 0.5 }}
									end={{ x: 0.8, y: 1 }}
								>
									{filterType !== "upcoming" && (
										<Text style={styles.filteredListEmptyText}>
											{emptyListMessage}
										</Text>
									)}
									{filterType === "upcoming" && (
										<>
											<Text style={styles.filteredListEmptyText}>
												{`No ${filterType} reservations yet.\nDo you wish to look for something?\n`}
											</Text>
											<OutlinedButton
												title="Let's go!"
												style={styles.emptyListButton}
												innerStyle={styles.emptyListButtonInner}
												onPress={noReservationsOutlinedButtonHandler}
											/>
										</>
									)}
								</LinearGradient>
							);

						if (itemData.item.reservationDateTimestamp > currentTimestamp)
							drawerType = "upcoming";

						if (itemData.item.reservationDateTimestamp < currentTimestamp)
							drawerType = "expired";

						if (
							(filterType === "upcoming" &&
								!(itemData.item.reservationDateTimestamp > currentTimestamp)) ||
							(filterType === "expired" &&
								!(itemData.item.reservationDateTimestamp < currentTimestamp))
						)
							return;

						//used for checking if there are any items after filtering (+1)
						listCounter += 1;

						const drawerOptionsButtons = drawerOptionsType({
							reservationDateCategory: drawerType,
							status: reservationStatus.type,

							//general: for all kinds
							general: {
								navigate: () => mapsRedirect({ url: itemData.item.url }),
								call: () =>
									callingRedirect({ phoneNumber: itemData.item.phone }),
							},
							expired: {
								//deletion is active, either for expired or cancelled reservations
								delete: () => deleteUserReservation(itemData.item.filename),

								//rating functionality only for expired and confirmed reservations
								rating: {
									onPress: () => {
										//check on user's database, if submitted
										if (itemData.item.ratingData?.isRated) return;

										ratingModalButtonHandler(itemData);
										//forward the data, to change state on user's database, if not submitted
									},
									title: itemData.item.ratingData?.isRated
										? `Your rating:\n${itemData.item.ratingData.rating} / 5`
										: "Rate us!",
								},
							},
							upcoming: {
								addCalendar: () =>
									addEvent({
										eventDate: itemData.item.reservationDateParameters,
										restaurantName: itemData.item.restaurantName,
										url: itemData.item.url,
										note: itemData.item.note,
									}),
								//cancellation request: only upcoming (either pending, call or confirmed statuses)
								cancel: {
									onPress: () => {
										//temporary disabled for development
										if (itemData.item.requestData) {
											Alert.alert(
												`Your ${itemData.item.requestData.requestType} request has been submitted.`,
												"Please call us if you have any further questions!",
												[{ text: "Close", style: "cancel" }]
											);

											return;
										}

										setRequestModalOpened({
											isOpened: true,
											reservationData: itemData.item,
										});
									},
									title: itemData.item.requestData
										? `${itemData.item.requestData.requestType} requested!`
										: "Request cancellation",
								},
							},
						});

						return (
							<ReservationListItem
								data={itemData.item}
								extraImages={extraImages}
								drawerOptionsButtons={drawerOptionsButtons}
								slideMenu
								//// animation only for the 1st render ////
								// firstLoad={isFirstLoad}
								firstLoad={true}
								reservationEntering={FadeInUp.delay(300)
									.duration(isFirstLoad && 1000)
									.springify()
									.mass(0.6)}
								extrasEntering={
									isFirstLoad &&
									FadeInRight.delay(1000).duration(1000).springify().mass(0.6)
								}
								statusColor={reservationStatus.bgColor}
								statusText={reservationStatus.status}
								statusTextColor="#ffffff"
								statusEntering={
									isFirstLoad &&
									FadeIn.delay(1500).duration(500).springify().mass(0.65)
								}
							/>
						);
					}}
				/>
			</LinearGradient>
		</>
	);
};

export default Reservations;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	emptyListInnerContainer: {
		justifyContent: "center",
	},
	emptyListLabel: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
	},
	filteredListEmptyContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: WIDTH * 0.6,
		marginHorizontal: WIDTH * 0.05,
		marginVertical: HEIGHT * 0.2,
		borderRadius: 20,
	},
	filteredListEmptyText: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center",
		fontWeight: "500",
		textShadowColor: "#ffffff",
		textShadowRadius: 5,
	},
	emptyListButton: {
		width: "30%",
		minWidth: 120,
		maxWidth: 150,
	},
	emptyListButtonInner: {
		width: "100%",
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
});

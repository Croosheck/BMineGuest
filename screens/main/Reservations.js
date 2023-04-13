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
import ReservationListItem from "../reservations/ReservationListItem";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { LinearGradient } from "expo-linear-gradient";
import LottieIcon from "../../components/LottieIcon";
import { SlideInRight, SlideInUp, ZoomInEasyUp } from "react-native-reanimated";
import { collection, onSnapshot, query } from "firebase/firestore";
import ReservationsFilters from "../../components/ReservationsFilters";
import OutlinedButton from "../../components/OutlinedButton";
import { drawerOptionsType } from "../../util/drawerOptionsType";
import { addEvent } from "../../components/AddEvent";
import { mapsRedirect } from "../../util/mapsRedirect";
import { callingRedirect } from "../../util/callingRedirect";
import {
	cancellationRequest,
	deleteUserReservation,
	updateRestaurantRating,
	updateUsersRatingStatus,
} from "../../util/storage";
import RatingModal from "../../components/ratingModal/RatingModal";
import RequestModal from "../../components/requestModal/RequestModal";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

const EXAMPLE_URL =
	"https://www.google.com/maps/place/POLONICA+RESTAURANT/@40.6254807,-74.029996,15z/data=!4m5!3m4!1s0x0:0x6fe0eebfd46532f6!8m2!3d40.6254807!4d-74.029996";

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

	// Extras fetch function - data and images
	async function getExtrasHandler() {
		const listRef = ref(storage, "extras");

		// List all images under the /extras/ path
		const response = await listAll(listRef);

		// Return, if the number of images inside state object === number of all images under extras/ path
		// - prevents from overloading
		if (extraImages.length === response.items.length) return;

		// For each extra item (image) from Storage - get a url and connect with extras
		response.items.forEach(async (item) => {
			const extraImgRef = ref(storage, `extras/${item.name}`);
			const extraImgUri = await getDownloadURL(extraImgRef);

			setExtraImages((prev) => {
				// Cut the image extension
				const itemName = item.name.match(/^.*(?=(\.))/g).join("");

				return {
					...prev,
					[itemName]: extraImgUri,
				};
			});
		});
	}

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

			getExtrasHandler();
		}
	}, []);

	function getReservationStatusHandler(itemData) {
		if (
			!itemData.item.confirmed &&
			!itemData.item.cancelled &&
			!itemData.item.callRequest
		)
			return {
				status: "Pending",
				bgColor: "#79B4FDA6",
				type: "pending",
			};
		if (
			!itemData.item.confirmed &&
			!itemData.item.cancelled &&
			itemData.item.callRequest
		)
			return {
				status: "Call Us!",
				bgColor: "#FFFFFFA6",
				type: "call",
			};
		if (itemData.item.confirmed)
			return {
				status: "Confirmed",
				bgColor: "#FFFA66A6",
				type: "confirmed",
			};
		if (itemData.item.cancelled)
			return {
				status: "Cancelled",
				bgColor: "#FF5858A6",
				type: "cancelled",
			};
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
						style={styles.noReservationsOutlinedButton}
						onPress={noReservationsOutlinedButtonHandler}
					/>
				</LinearGradient>
			</LinearGradient>
		);
	}

	function filterButtonHandler(type) {
		//Anim-reservations only for the 1st render
		setIsFirstLoad(false);

		setFilterType(type);
		if (type === "upcoming" || type === "expired")
			setEmptyListMessage(`No ${type} reservations yet.`);
	}

	let listCounter;
	let reservationDateCategory;

	function ratingModalButtonHandler(itemData) {
		setRatingModalOpened({ isOpened: true, reservationData: itemData.item });
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

					//saves the rating for the particular reservation in the database
					//and disables the rating button
					// updateUsersRatingStatus(
					// 	ratingModalOpened.reservationData.filename,
					// 	rating.rating
					// );

					//saves the rating for the particular restaurant in the database
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

						const reservationStatus = getReservationStatusHandler(itemData);
						const currentTimestamp = new Date().valueOf();

						//check if the list is empty, upon filtering
						if (
							((filterType === "upcoming" &&
								!(itemData.item.reservationDateTimestamp > currentTimestamp)) ||
								(filterType === "expired" &&
									!(
										itemData.item.reservationDateTimestamp < currentTimestamp
									))) &&
							//check if that's the last item
							itemData.index === reservationsData.length - 1 &&
							//check if there weren't any items after filtering
							listCounter === 0
						)
							return (
								<LinearGradient
									colors={["#A8181846", "#0A163E82"]}
									style={styles.filteredListEmptyContainer}
									start={{ x: 0, y: 0.5 }}
									end={{ x: 0.8, y: 1 }}
								>
									<Text style={styles.filteredListEmptyText}>
										{emptyListMessage}
									</Text>
								</LinearGradient>
							);

						if (itemData.item.reservationDateTimestamp > currentTimestamp)
							reservationDateCategory = "upcoming";
						if (itemData.item.reservationDateTimestamp < currentTimestamp)
							reservationDateCategory = "expired";

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
							reservationDateCategory: reservationDateCategory,
							status: reservationStatus.type,

							//general: for all kinds
							general: {
								navigate: () => mapsRedirect({ url: EXAMPLE_URL }),
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
										//forward the data, to
										//change state on user's database,
										//if not submitted
									},
									title: itemData.item.ratingData?.isRated
										? `Your rating:\n${itemData.item.ratingData.rating} / 5`
										: "Rate us!",
								},
							},
							upcoming: {
								addCalendar: () =>
									addEvent(
										itemData.item.reservationDateParameters,
										itemData.item.restaurantName
									),
								//cancellation request: only upcoming, either pending, call or confirmed statuses
								cancel: {
									onPress: () => {
										////temporary disabled for development
										// if (itemData.item.requestData) {
										// 	Alert.alert(
										// 		`Your ${itemData.item.requestData.requestType} request has been submitted.`,
										// 		"Please call us for any further information!",
										// 		[{ text: "Thanks!", style: "cancel" }]
										// 	);

										// 	return;
										// }

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
								restaurantName={itemData.item.restaurantName}
								reservationDateTimestamp={
									itemData.item.reservationDateTimestamp
								}
								reservationDate={itemData.item.reservationDate}
								reservationDateParameters={
									itemData.item.reservationDateParameters
								}
								madeOnDate={itemData.item.madeOnTimestamp}
								extras={itemData.item.extras}
								extraImages={extraImages}
								table={itemData.item.table}
								restaurantUid={itemData.item.restaurantUid}
								drawerOptionsButtons={drawerOptionsButtons}
								slideMenu
								// animation only for the 1st render
								firstLoad={isFirstLoad}
								// firstLoad={true}
								reservationEntering={ZoomInEasyUp.delay(500)
									.duration(1000)
									.springify()
									.mass(0.6)}
								extraEntering={SlideInUp.delay(800)
									.duration(1000)
									.springify()
									.mass(0.6)}
								statusColor={reservationStatus.bgColor}
								statusText={reservationStatus.status}
								statusTextColor="#ffffff"
								statusEntering={SlideInRight.delay(1600)
									.duration(500)
									.springify()
									.mass(0.65)}
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
	noReservationsOutlinedButton: {
		maxHeight: 50,
		minWidth: 100,
	},
});

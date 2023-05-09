import { useFonts } from "expo-font";

import {
	Dimensions,
	FlatList,
	ImageBackground,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useEffect, useState } from "react";

import { formatDate } from "../../../util/formatDate";
import ExtraItem from "./extras/ExtraItem";
import { getRestaurantProfileImage } from "../../../util/storage";

import { LinearGradient } from "expo-linear-gradient";

import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import DrawerOptions from "./drawer/DrawerOptions";

import DetailsModal from "./reservationListItem/DetailsModal";

import { normalizeFontSize } from "../../../util/normalizeFontSize";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const BORDER_RADIUS = 14;

const ReservationListItem = ({
	extraImages = new Object(),
	reservationEntering,
	extrasEntering,
	statusEntering,
	statusColor = String(),
	statusText = String(),
	statusTextColor = String(),
	firstLoad = Boolean(),
	drawerOptionsButtons = Array(),
	slideMenu = Boolean(),

	data = {
		restaurantName: "",
		madeOnTimestamp: Number(),
		reservationDateTimestamp: Number(),
		reservationDate: "",
		reservationDateParameters: Object(),
		madeOnTimestamp: Number(),
		extras: [],
		extrasTotalPrice: String(),
		table: Object(),
		howMany: Number(),
		restaurantUid: "",
		note: "",
	},
}) => {
	const [displayedExtraName, setDisplayedExtraName] = useState();
	const [reservationBackgroundUri, setReservationBackgroundUri] = useState();
	const [animationFinished, setAnimationFinished] = useState(true);
	const [detailsModal, setDetailsModal] = useState({
		isOpened: false,
	});

	const {
		restaurantName,
		reservationDateTimestamp,
		reservationDate,
		reservationDateParameters,
		madeOnTimestamp,
		extras,
		extrasTotalPrice: extrasPrice,
		table,
		howMany,
		restaurantUid,
		note,
	} = data;

	const [fontsLoaded] = useFonts({
		"PTS-Reg": require("../../../assets/fonts/PTSans-Regular.ttf"),
		"PTS-Bold": require("../../../assets/fonts/PTSans-Bold.ttf"),
		"TiltNeon-Reg": require("../../../assets/fonts/TiltNeon-Regular.ttf"),
		"Anton-Reg": require("../../../assets/fonts/Anton-Regular.ttf"),
		"SourceCodePro-SB": require("../../../assets/fonts/SourceCodePro-SemiBold.ttf"),
	});

	const formatedReservationDate = formatDate(
		null,
		null,
		reservationDateParameters
	);

	const formatedMadeOnDate = formatDate(madeOnTimestamp);

	const animatedTranslateX = useSharedValue(-WIDTH);

	const gestureTranslateXDefault = 0;
	const gestureTranslateXOpened = 120;
	const gestureHandlerTranslateX = useSharedValue(gestureTranslateXDefault);

	const drawerGestureHandler = useAnimatedGestureHandler({
		onStart: (event, ctx) => {
			// pressed.value = true;
			ctx.startX = gestureHandlerTranslateX.value;
		},
		onActive: (event, ctx) => {
			if (ctx.startX + event.translationX > 0) {
				gestureHandlerTranslateX.value = 0;
				return;
			}

			gestureHandlerTranslateX.value =
				ctx.startX + event.translationX >= -gestureTranslateXOpened
					? ctx.startX + event.translationX
					: -gestureTranslateXOpened;
		},
		onEnd: (event, ctx) => {
			// pressed.value = false;
			if (gestureHandlerTranslateX.value <= -(gestureTranslateXOpened / 2)) {
				gestureHandlerTranslateX.value = withSpring(-gestureTranslateXOpened);
				return;
			}

			if (gestureHandlerTranslateX.value > -(gestureTranslateXOpened / 2)) {
				gestureHandlerTranslateX.value = withSpring(0);
				return;
			}

			gestureHandlerTranslateX.value = gestureHandlerTranslateX.value;
		},
	});

	function hidePreviousExtraLabel() {
		setAnimationFinished(false);
		animatedTranslateX.value = withSpring(WIDTH, { mass: 0.4 });
	}
	function showNextExtraLabel(itemData) {
		clearTimeout(backToDefaultTimeout);
		//time period between names changing
		const backToDefaultTimeout = setTimeout(() => {
			animatedTranslateX.value = -WIDTH;
			setDisplayedExtraName(
				`${itemData.item.xName} (${itemData.item.xPrice}$)`
			);

			animatedTranslateX.value = withSpring(0, { mass: 0.1, velocity: 100 });

			setAnimationFinished(true);
		}, 60);
	}

	// Extras title with animation
	function displayExtraName(itemData) {
		if (displayedExtraName) {
			if (!animationFinished) return;
			hidePreviousExtraLabel();

			showNextExtraLabel(itemData);
			return;
		}

		setDisplayedExtraName(`${itemData.item.xName} (${itemData.item.xPrice}$)`);
		animatedTranslateX.value = withSpring(0, { mass: 0.4 });
	}

	//reservation slide gesture
	const reanimatedDrawerGesture = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: gestureHandlerTranslateX.value }],
		};
	});

	//reservation's option buttons appearance on slide gesture
	const reanimatedDrawerGestureButtonScale = useAnimatedStyle(() => {
		const gestureOptionsDrawerValue = Math.abs(
			gestureHandlerTranslateX.value / gestureTranslateXOpened
		);
		return {
			transform: [
				{
					scale: gestureOptionsDrawerValue,
				},
				{
					translateX:
						gestureTranslateXOpened - Math.abs(gestureHandlerTranslateX.value),
				},
			],
			opacity: gestureOptionsDrawerValue,
		};
	});

	//reservation extra's name slide animations on image press
	const reanimatedExtraName = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: animatedTranslateX.value }],
		};
	});

	useEffect(() => {
		async function getRestaurantDataHandler() {
			const profileImage = await getRestaurantProfileImage(restaurantUid);
			setReservationBackgroundUri(profileImage);
		}

		getRestaurantDataHandler();
	}, []);

	function openDetailsModalHandler() {
		setDetailsModal({
			isOpened: true,
		});
	}

	return (
		<>
			<DetailsModal
				modalState={detailsModal}
				closeModal={() => {
					setDetailsModal({ isOpened: false });
				}}
				restaurantName={restaurantName}
				restaurantImageUri={reservationBackgroundUri}
				howMany={howMany}
				madeOnTimestamp={madeOnTimestamp}
				reservationDateTimestamp={reservationDateTimestamp}
				reservationDate={reservationDate}
				table={table}
				extras={extras}
				extraImages={extraImages}
				extrasPrice={extrasPrice}
				note={note}
			/>
			<Pressable
				onPress={() => {
					openDetailsModalHandler();
				}}
			>
				{reservationBackgroundUri && extraImages && (
					<Animated.View
						entering={firstLoad && reservationEntering}
						style={styles.mainContainer}
					>
						{slideMenu && (
							<DrawerOptions
								buttonsData={drawerOptionsButtons}
								width={gestureTranslateXOpened + BORDER_RADIUS}
								textCenteringMargin={BORDER_RADIUS}
								buttonCornerRadius={BORDER_RADIUS}
								animatedScale={reanimatedDrawerGestureButtonScale}
							/>
						)}
						<Animated.View
							style={[
								styles.drawerContainer,
								slideMenu && reanimatedDrawerGesture,
							]}
						>
							<LinearGradient
								colors={["#212121", "#FFFFFF", "#303030"]}
								style={styles.gradientBackgroundContainer}
								start={{ x: 0, y: 0.4 }}
								end={{ x: 0.3, y: 1 }}
							>
								<ImageBackground
									source={{ uri: reservationBackgroundUri }}
									style={styles.innerBackgroundContainer}
									imageStyle={styles.imageBackground}
									resizeMode="stretch"
									blurRadius={3}
								>
									<PanGestureHandler
										onGestureEvent={slideMenu && drawerGestureHandler}
										activeOffsetX={[-25, 25]}
									>
										<Animated.View
											style={[
												styles.dataContainer,
												extras.length === 0 && { flex: 1 },
											]}
										>
											<View style={styles.dataInnerContainer}>
												<Text
													style={[
														styles.restaurantName,
														styles.textShadow,
														{ fontSize: normalizeFontSize(26) },
														extras.length === 0 && { marginTop: 10 },
													]}
													numberOfLines={1}
												>
													{restaurantName}
												</Text>
												<View style={styles.datesDataContainer}>
													<View style={styles.reservedOnContainer}>
														<Text
															style={[
																styles.reservationDetailText,
																{ fontSize: normalizeFontSize(20) },
																styles.textShadow,
															]}
														>
															{formatedMadeOnDate}
														</Text>
														<Text
															style={[
																styles.dateLabel,
																{ fontSize: normalizeFontSize(12) },
																styles.textShadow,
															]}
														>
															Reserved on
														</Text>
														<Text
															style={[
																styles.dateLabel,
																{ fontSize: normalizeFontSize(12) },

																styles.textShadow,
																styles.dateLabelTextBelow,
																{ fontSize: normalizeFontSize(9) },
															]}
														>
															(Current Location Time)
														</Text>
													</View>

													<View style={styles.reservationDateContainer}>
														<Text
															style={[
																styles.reservationDetailText,
																{ fontSize: normalizeFontSize(20) },
																styles.textShadow,
															]}
														>
															{formatedReservationDate.isData
																? formatedReservationDate.dateResult
																: reservationDate}
														</Text>
														<Text
															style={[
																styles.dateLabel,
																{ fontSize: normalizeFontSize(12) },
																styles.textShadow,
															]}
														>
															Reservation date
														</Text>
														<Text
															style={[
																styles.dateLabel,
																{ fontSize: normalizeFontSize(12) },

																styles.textShadow,
																styles.dateLabelTextBelow,
																{ fontSize: normalizeFontSize(9) },
															]}
														>
															(Restaurant's Local Time)
														</Text>
													</View>
												</View>
												<Text
													style={[
														styles.tablePlacement,
														{ fontSize: normalizeFontSize(18) },
														styles.textShadow,
													]}
													numberOfLines={1}
												>
													Table placement: {table.tPlacement}
												</Text>
											</View>
										</Animated.View>
									</PanGestureHandler>

									{!!extras.length && (
										<View style={styles.extrasContainer}>
											<Animated.View
												style={{ flex: 0.75 }}
												onStartShouldSetResponder={(event) => true}
												onTouchEnd={(e) => {
													e.stopPropagation();
												}}
												entering={firstLoad && extrasEntering}
											>
												<FlatList
													data={extras}
													keyExtractor={(item, index) => index}
													horizontal={true}
													style={styles.extrasFlatList}
													contentContainerStyle={styles.extrasFlatListContent}
													renderItem={(itemData) => {
														return (
															<ExtraItem
																onPress={displayExtraName.bind(this, itemData)}
																imgUri={
																	extraImages &&
																	extraImages[itemData.item.xShortFileName]
																}
															/>
														);
													}}
												/>
											</Animated.View>
											<Animated.View
												style={[
													styles.displayedExtraNameContainer,
													reanimatedExtraName,
												]}
											>
												<Text
													style={[
														styles.displayedExtraName,
														{ fontSize: normalizeFontSize(15) },
														styles.textShadow,
													]}
												>
													{displayedExtraName}
												</Text>
											</Animated.View>
										</View>
									)}
									<View
										style={[
											styles.reservationStatus,
											{ backgroundColor: statusColor },
										]}
									>
										<Animated.Text
											entering={firstLoad && statusEntering}
											style={[
												styles.reservationStatusTitle,
												styles.textShadow,
												{
													color: statusTextColor,
													fontSize: normalizeFontSize(14),
												},
											]}
										>
											{statusText}
										</Animated.Text>
									</View>
								</ImageBackground>
							</LinearGradient>
						</Animated.View>
					</Animated.View>
				)}
			</Pressable>
		</>
	);
};

export default ReservationListItem;

const styles = StyleSheet.create({
	textShadow: {
		textShadowColor: "#000000A4",
		textShadowOffset: { height: 3, width: 0 },
		textShadowRadius: 5,
	},
	////////////////////////////////////////
	mainContainer: {
		height: WIDTH * 0.65,
		margin: HEIGHT * 0.015,
		justifyContent: "center",
		borderRadius: BORDER_RADIUS,
	},
	drawerContainer: {
		zIndex: 2,
	},
	gradientBackgroundContainer: {
		justifyContent: "center",
		borderRadius: BORDER_RADIUS,
		overflow: "hidden",
		height: "100%",
	},
	innerBackgroundContainer: {
		flex: 1,
		margin: 2,
		overflow: "hidden",
		borderRadius: BORDER_RADIUS - 1.5,
	},
	imageBackground: {
		opacity: 0.8,
	},
	dataContainer: {
		flex: 0.7,
	},
	dataInnerContainer: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000060",
	},
	restaurantName: {
		// flex: 0.8,
		color: "#ffffff",
		fontWeight: "800",
	},
	datesDataContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: WIDTH * 0.03,
		marginBottom: 15,
		flex: 1,
	},
	reservedOnContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	reservationDateContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	reservationDetailText: {
		color: "#ffffff",
		fontFamily: "SourceCodePro-SB",
		letterSpacing: -2.5,
	},
	dateLabel: {
		color: "#ffffff",
		textTransform: "uppercase",
		fontFamily: "PTS-Bold",
	},
	dateLabelTextBelow: {
		fontFamily: null,
	},
	tablePlacement: {
		width: "100%",
		textAlign: "center",
		color: "#ffffff",
		fontFamily: "PTS-Bold",
		flex: 0.5,
	},
	extrasContainer: {
		flex: 0.5,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000060",
		borderTopWidth: 0.8,
		borderColor: "#FFFFFFB3",
	},
	extrasFlatList: {
		borderBottomWidth: 0.5,
		borderColor: "#FFFFFF",
	},
	extrasFlatListContent: {
		alignItems: "center",
	},
	displayedExtraNameContainer: {
		flex: 0.25,
		justifyContent: "center",
		alignItems: "center",
	},
	displayedExtraName: {
		color: "#ffffff",
		fontWeight: "500",
	},
	reservationStatus: {
		position: "absolute",
		bottom: 0,
		right: -0.1,
		borderTopLeftRadius: BORDER_RADIUS - 1.5,
		paddingVertical: 1,
		minWidth: "25%",
	},
	reservationStatusTitle: {
		textAlign: "center",
		fontWeight: "bold",
	},
});

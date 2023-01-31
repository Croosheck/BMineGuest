import {
	Dimensions,
	FlatList,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useEffect, useState } from "react";

import { formatDate } from "../../util/formatDate";
import ExtraItem from "./ExtraItem";
import { getRestaurantProfileImage } from "../../util/storage";

import { LinearGradient } from "expo-linear-gradient";

import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import DrawerOptions from "./DrawerOptions";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const BORDER_RADIUS = 14;

const ReservationListItem = ({
	restaurantName = String(),
	reservationDateTimestamp = Number(),
	madeOnDate = Number(),
	table = Array(),
	extras = Array(),
	extraImages = new Object(),
	restaurantUid = String(),
	reservationEntering,
	extraEntering,
	statusEntering,
	statusColor = String(),
	statusText = String(),
	statusTextColor = String(),
	firstLoad = Boolean(),
	drawerOptionsButtons = Array(),
	slideMenu = Boolean(),
	reservationDateCategory = String(),
}) => {
	const [displayedExtraName, setDisplayedExtraName] = useState();
	const [reservationBackgroundUri, setReservationBackgroundUri] = useState();
	const [animationFinished, setAnimationFinished] = useState(true);

	const formatedReservationDate = formatDate(reservationDateTimestamp);
	const formatedMadeOnDate = formatDate(madeOnDate);

	const animatedTranslateX = useSharedValue(-1000);

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

	let backToDefaultTimeout;

	// Extras title with animation
	function displayExtraName(itemData) {
		const { width: WIDTH } = Dimensions.get("window");

		if (displayedExtraName) {
			if (!animationFinished) return;
			setAnimationFinished(false);
			animatedTranslateX.value = withSpring(WIDTH * 2, { mass: 0.6 });

			//time period between names changing
			backToDefaultTimeout = setTimeout(() => {
				animatedTranslateX.value = -WIDTH * 2;
				setDisplayedExtraName(
					`${itemData.item.xName} (${itemData.item.xPrice}$)`
				);

				animatedTranslateX.value = withSpring(0, { mass: 0.6 });

				setAnimationFinished(true);
				clearTimeout(backToDefaultTimeout);
			}, 80);
			return;
		}

		setDisplayedExtraName(`${itemData.item.xName} (${itemData.item.xPrice}$)`);
		animatedTranslateX.value = withSpring(0);
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

	return (
		<>
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
						style={[styles.drawerContainer, reanimatedDrawerGesture]}
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
									<Animated.View style={styles.dataContainer}>
										<View style={styles.dataInnerContainer}>
											<Text
												style={[styles.restaurantName, styles.textShadow]}
												numberOfLines={1}
											>
												{restaurantName}
											</Text>
											<View style={styles.datesDataContainer}>
												<View style={styles.reservedOnContainer}>
													<Text
														style={[
															styles.reservationDetailText,
															styles.textShadow,
														]}
													>
														{formatedMadeOnDate}
													</Text>
													<Text style={[styles.dateLabel, styles.textShadow]}>
														Reserved on
													</Text>
												</View>

												<View style={styles.reservationDateContainer}>
													<Text
														style={[
															styles.reservationDetailText,
															styles.textShadow,
														]}
													>
														{formatedReservationDate}
													</Text>
													<Text style={[styles.dateLabel, styles.textShadow]}>
														Reservation date
													</Text>
												</View>
											</View>
											<Text
												style={[styles.tablePlacement, styles.textShadow]}
												numberOfLines={1}
											>
												Table placement: {table.tPlacement}
											</Text>
										</View>
									</Animated.View>
								</PanGestureHandler>

								<View style={styles.extrasContainer}>
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
													extraEntering={firstLoad && extraEntering}
												/>
											);
										}}
									/>
									<Animated.View
										style={[
											styles.displayedExtraNameContainer,
											reanimatedExtraName,
										]}
									>
										<Text
											style={[styles.displayedExtraName, styles.textShadow]}
										>
											{displayedExtraName}
										</Text>
									</Animated.View>
								</View>
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
		flex: 0.8,
		color: "#ffffff",
		fontSize: 26,
		fontWeight: "800",
	},
	datesDataContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
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
		fontSize: 18,
		fontWeight: "600",
	},
	dateLabel: {
		color: "#ffffff",
		fontSize: 11,
		textTransform: "uppercase",
	},
	tablePlacement: {
		width: "100%",
		textAlign: "center",
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
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
		borderBottomWidth: 1.5,
		borderColor: "#FFFFFF",
	},
	extrasFlatListContent: {
		alignItems: "center",
	},
	displayedExtraNameContainer: {
		flex: 1.5,
		justifyContent: "center",
		alignItems: "center",
	},
	displayedExtraName: {
		color: "#ffffff",
		fontSize: 15,
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

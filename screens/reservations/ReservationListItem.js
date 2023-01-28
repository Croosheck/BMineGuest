import {
	Button,
	Dimensions,
	FlatList,
	ImageBackground,
	StyleSheet,
	Text,
	View,
} from "react-native";

import React, { useEffect, useState } from "react";

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
const BORDER_RADIUS = 12;

const ReservationListItem = ({
	restaurantName,
	reservationDateTimestamp,
	madeOnDate,
	table,
	extras,
	extraImages,
	restaurantUid,
	reservationEntering,
	reservationExiting,
	extraEntering,
	statusEntering,
	statusColor,
	statusText,
	statusTextColor,
	firstLoad,
}) => {
	const [displayedExtraName, setDisplayedExtraName] = useState();
	const [reservationBackgroundUri, setReservationBackgroundUri] = useState();
	const [animationFinished, setAnimationFinished] = useState(true);
	const [drawerOptionsButtonAnimation, setDrawerOptionsButtonAnimation] =
		useState({
			scale: 0,
		});

	const formatedReservationDate = formatDate(reservationDateTimestamp);
	const formatedMadeOnDate = formatDate(madeOnDate);

	const animatedTranslateX = useSharedValue(-1000);

	const gestureTranslateXDefault = 0;
	const gestureTranslateXOpened = 100;
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
			if (gestureHandlerTranslateX.value <= -50) {
				gestureHandlerTranslateX.value = withSpring(-gestureTranslateXOpened);
				return;
			}

			if (gestureHandlerTranslateX.value > -50) {
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

	const drawerOptionsButtons = [
		{
			title: "Button 1",
			onPress: () => console.log("Button 1"),
		},
		{
			title: "Button 2",
			onPress: () => console.log("Button 2"),
		},
		{
			title: "Button 3",
			onPress: () => console.log("Button 3"),
		},
		// {
		// 	title: "Button 4",
		// 	onPress: () => console.log("Button 4"),
		// },
	];

	return (
		<>
			{/* <Button
				title="reset"
				onPress={() => (gestureHandlerTranslateX.value = 0)}
			/> */}
			{reservationBackgroundUri && extraImages && (
				<Animated.View
					entering={firstLoad && reservationEntering}
					style={styles.mainContainer}
				>
					<DrawerOptions
						buttonsData={drawerOptionsButtons}
						width={gestureTranslateXOpened + BORDER_RADIUS}
						textCenteringMargin={BORDER_RADIUS}
						buttonCornerRadius={BORDER_RADIUS}
						animatedScale={reanimatedDrawerGestureButtonScale}
					/>
					<Animated.View
						style={[styles.drawerContainer, reanimatedDrawerGesture]}
					>
						<LinearGradient
							colors={["#000000CC", "#FFFFFF", "#020202B7"]}
							style={styles.gradientBackgroundContainer}
							start={{ x: 1, y: 1 }}
							end={{ x: 0, y: 0 }}
						>
							<ImageBackground
								source={{ uri: reservationBackgroundUri }}
								style={styles.innerBackgroundContainer}
								imageStyle={styles.imageBackground}
								resizeMode="stretch"
							>
								<PanGestureHandler
									onGestureEvent={drawerGestureHandler}
									// activateAfterLongPress={70}
									activeOffsetX={[-25, 25]}
								>
									<Animated.View style={styles.dataContainer}>
										<View style={styles.dataInnerContainer}>
											<Text style={styles.restaurantName}>
												{restaurantName}
											</Text>
											<Text style={styles.dates}>
												Reserved on: {formatedMadeOnDate}
											</Text>
											<Text style={styles.dates}>
												Reservation Date: {formatedReservationDate}
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
									<Animated.View style={[reanimatedExtraName]}>
										<Text style={styles.displayedExtraName}>
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
										style={{
											textAlign: "center",
											fontWeight: "bold",
											color: statusTextColor,
										}}
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
	mainContainer: {
		// backgroundColor: "#98989817",
		height: WIDTH * 0.65,
		margin: WIDTH * 0.03,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 15,
		// overflow: "hidden",

		// elevation: 8,
		// shadowColor: "#ffffff",
		// shadowOpacity: 0.5,
		// shadowOffset: { width: 0, height: 2 },
		// shadowRadius: 5,
	},
	drawerContainer: {
		zIndex: 2,
	},
	gradientBackgroundContainer: {
		padding: 3,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 15,
		overflow: "hidden",
	},
	innerBackgroundContainer: {
		flex: 1,
		width: "100%",
		// transform: [{ translateX: -50 }],
	},
	imageBackground: {
		opacity: 0.9,
		borderRadius: 12,
	},
	dataContainer: {
		flex: 0.7,
		justifyContent: "center",
		alignItems: "center",
	},
	dataInnerContainer: {
		flex: 0.8,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000060",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#ffffff",
	},
	restaurantName: {
		color: "#ffffff",
		fontSize: 24,
		fontWeight: "800",
	},
	dates: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "500",
	},
	extrasContainer: {
		flex: 0.5,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000060",
		borderTopWidth: 0.8,
		borderColor: "#ffffff",
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	extrasFlatList: {
		maxHeight: WIDTH * 0.16,
		borderBottomWidth: 1.5,
		borderColor: "#ffffff",
	},
	extrasFlatListContent: {},
	displayedExtraName: {
		color: "#ffffff",
		fontSize: 16,
		marginTop: 4,
		fontWeight: "500",
	},
	reservationStatus: {
		position: "absolute",
		bottom: -0.1,
		right: -0.1,
		borderTopLeftRadius: 15,
		borderBottomRightRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 1,
		minWidth: 90,
	},
});

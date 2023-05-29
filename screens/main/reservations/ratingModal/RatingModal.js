import { Dimensions, Modal, StyleSheet, View } from "react-native";
import ModalButton from "./ModalButton";
import StarRating from "react-native-star-rating-widget";
import LottieIcon from "../../../../components/LottieIcon";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useState } from "react";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
const modalSize = {
	x: WIDTH * 0.75,
	y: HEIGHT * 0.33,
};
const CONTAINER_PADDING = {
	HORIZONTAL: 10,
	BOTTOM: 15,
	TOP: 5,
};
const BUTTON_WIDTH = 100;
const BUTTON_CENTERED =
	modalSize.x * 0.5 -
	CONTAINER_PADDING.HORIZONTAL * 0.5 -
	BUTTON_WIDTH * 0.5 -
	//button's horizontal padding
	2.5;

const RatingModal = ({
	onCloseModal = () => {},
	restaurantName,
	onSubmit = () => {},
	visible = Boolean(),
	rating = Number(),
	onChangeRating = (number) => {},
	submitted = Boolean(),
}) => {
	const [animationFinished, setAnimationFinished] = useState(true);

	//////// ANIMATED SHARED VALUES ////////
	const titleAnimatedScaleOpacity = useSharedValue(1);
	const starsAnimatedScaleOpacity = useSharedValue(1);

	const cancelAnimatedTranslate = useSharedValue(modalSize.x * 0.08);
	const cancelAnimatedRotate = useSharedValue(0);

	const submitAnimatedTranslate = useSharedValue(0);
	//////// ANIMATED STYLES ////////
	const reanimatedTitleStyle = useAnimatedStyle(() => ({
		opacity: titleAnimatedScaleOpacity.value,
	}));
	const reanimatedStarsStyle = useAnimatedStyle(() => ({
		opacity: starsAnimatedScaleOpacity.value,
		transform: [{ scale: starsAnimatedScaleOpacity.value }],
	}));

	const reanimatedCancelStyle = useAnimatedStyle(() => ({
		left: cancelAnimatedTranslate.value,
		transform: [{ rotate: `${cancelAnimatedRotate.value}deg` }],
	}));
	const reanimatedSubmitStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: submitAnimatedTranslate.value }],
	}));

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="fade"
			onRequestClose={onCloseModal}
			hardwareAccelerated
			statusBarTranslucent
		>
			<View style={{ flex: 1, backgroundColor: "#00000075" }}>
				<View style={styles.modalContainer}>
					<View style={styles.innerModalContainer}>
						<Animated.Text
							style={[styles.modalRatingTitle, reanimatedTitleStyle]}
						>
							{`How would you rate the service, regarding your reservation details, in ${restaurantName} ?`}
						</Animated.Text>
						<View style={styles.modalRatingStarsContainer}>
							{!submitted ? (
								<Animated.View style={[reanimatedStarsStyle]}>
									<StarRating
										rating={rating <= 1 ? 1 : rating}
										onChange={(number) => onChangeRating(number)}
										animationConfig={{
											delay: 0,
											duration: 700,
											scale: 1.3,
										}}
										color="#3dbdff"
									/>
								</Animated.View>
							) : (
								<LottieIcon
									source={require("../../../../assets/lottie/lottieSuccess1.json")}
									height={"100%"}
									autoPlay
									loop={false}
								/>
							)}
						</View>
						<View style={styles.modalButtonsContainer}>
							<Animated.View
								style={[styles.buttonCancel, reanimatedCancelStyle]}
							>
								<ModalButton
									title={!submitted ? "CANCEL" : "CLOSE"}
									onPress={() => {
										if (!animationFinished) return;

										onCloseModal();
										setTimeout(() => {
											titleAnimatedScaleOpacity.value = 1;
											starsAnimatedScaleOpacity.value = 1;
											submitAnimatedTranslate.value = 0;
											cancelAnimatedTranslate.value = modalSize.x * 0.08;
											cancelAnimatedRotate.value = 0;
										}, 800);
									}}
									buttonWidth={BUTTON_WIDTH}
								/>
							</Animated.View>
							<Animated.View
								style={[styles.buttonSubmit, reanimatedSubmitStyle]}
							>
								<ModalButton
									title="SUBMIT"
									onPress={() => {
										setAnimationFinished(false);
										titleAnimatedScaleOpacity.value = withTiming(0, {
											duration: 600,
										});
										starsAnimatedScaleOpacity.value = withTiming(
											0,
											{ duration: 600 },
											() => {
												cancelAnimatedRotate.value = withSpring(360, {
													mass: 1,
												});
												//changes the "submitted" boolean state
												runOnJS(onSubmit)();

												//moving the submit button down
												submitAnimatedTranslate.value = withTiming(
													modalSize.y,
													{ duration: 500 },
													() => {
														//centering the cancel button
														cancelAnimatedTranslate.value = withSpring(
															BUTTON_CENTERED,
															{ mass: 0.8 },
															() => runOnJS(setAnimationFinished)(true)
														);
													}
												);
											}
										);
									}}
									buttonWidth={BUTTON_WIDTH}
								/>
							</Animated.View>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default RatingModal;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		width: modalSize.x,
		height: modalSize.y,
		backgroundColor: "#FFFFFF",
		position: "absolute",
		top: HEIGHT * 0.5 - modalSize.y * 0.5,
		left: WIDTH * 0.5 - modalSize.x * 0.5,
		borderRadius: 10,
		overflow: "hidden",
	},
	innerModalContainer: {
		flex: 1,
		paddingHorizontal: CONTAINER_PADDING.HORIZONTAL,
		paddingBottom: CONTAINER_PADDING.BOTTOM,
		paddingTop: CONTAINER_PADDING.TOP,
	},
	modalRatingTitle: {
		textAlign: "center",
		fontSize: 17,
		fontWeight: "500",
	},
	modalRatingStarsContainer: {
		flex: 1,
		marginVertical: 10,
		// backgroundColor: "#cccccc",
		justifyContent: "center",
		alignItems: "center",
	},
	modalButtonsContainer: {
		flex: 0.4,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	buttonCancel: {
		position: "absolute",
		bottom: 0,
	},
	buttonSubmit: {
		position: "absolute",
		bottom: 0,
		right: modalSize.x * 0.08,
	},
});

import { useRef, useEffect } from "react";
import { Pressable, StyleSheet, Animated as Anim, Easing } from "react-native";

import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const LottieAnimButton = ({
	onLottiePress = () => {},
	isSuccess = false,
	durationMultiplier = 1,
	successDuration = 1000,
	error = {
		isError: false,
	},
	lottieSource = "",
	statusGradient = {
		error: ["#FFFFFF", "#FF9898"],
		success: ["#FFFFFF", "#FFDE8A"],
	},
}) => {
	const animationProgress = useRef(new Anim.Value(0.35));

	const buttonAnimatedTranslateX = useSharedValue(0);
	const lottieAnimatedRotateZ = useSharedValue(0);

	const reanimatedButtonStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: buttonAnimatedTranslateX.value }],
	}));
	const reanimatedLottieStyle = useAnimatedStyle(() => ({
		transform: [{ rotateZ: `${lottieAnimatedRotateZ.value}deg` }],
	}));

	useEffect(() => {
		if (isSuccess) {
			lottieAnimatedRotateZ.value = withTiming(-15, { duration: 200 });

			Anim.timing(animationProgress.current, {
				toValue: 0.5,
				duration: successDuration * durationMultiplier,
				easing: Easing.linear,
				useNativeDriver: false,
			}).start();
		}

		if (error.isError) {
			buttonAnimatedTranslateX.value = withSequence(
				withTiming(10, { duration: 120 * durationMultiplier }),
				withTiming(-8, { duration: 140 * durationMultiplier }),
				withTiming(5, { duration: 160 * durationMultiplier }),
				withTiming(-3, { duration: 190 * durationMultiplier }),
				withTiming(0, { duration: 220 * durationMultiplier })
			);
			lottieAnimatedRotateZ.value = withSequence(
				withTiming(20, { duration: 120 * durationMultiplier }),
				withTiming(-15, { duration: 140 * durationMultiplier }),
				withTiming(10, { duration: 160 * durationMultiplier }),
				withTiming(-5, { duration: 190 * durationMultiplier }),
				withTiming(0, { duration: 220 * durationMultiplier })
			);
		}
	}, [isSuccess, error]);

	function buttonStatusGradient() {
		if (error.isError) return statusGradient.error;
		if (isSuccess) return statusGradient.success;

		return ["#FFFFFF", "#CCCCCC"];
	}

	return (
		<Animated.View
			style={[
				styles.lottieButtonContainer,
				reanimatedButtonStyle,
				error.isError && styles.lottieError,
				isSuccess && styles.lottieSuccess,
			]}
		>
			<LinearGradient colors={buttonStatusGradient()}>
				<Pressable
					onPress={onLottiePress}
					android_ripple={{ color: "#CCCCCC6B" }}
					style={{
						padding: 4,
					}}
				>
					<Animated.View style={reanimatedLottieStyle}>
						<LottieView
							source={lottieSource}
							progress={animationProgress.current}
							style={styles.lottieFile}
							resizeMode="cover"
						/>
					</Animated.View>
				</Pressable>
			</LinearGradient>
		</Animated.View>
	);
};

export default LottieAnimButton;

const styles = StyleSheet.create({
	lottieButtonContainer: {
		backgroundColor: "#E9E9E9",
		borderRadius: 15,
		overflow: "hidden",
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#D4D4D4",
	},
	lottieError: {
		backgroundColor: "#FFAAAA",
	},
	lottieSuccess: {
		backgroundColor: "#D9FFEF",
	},
	lottieFile: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
});

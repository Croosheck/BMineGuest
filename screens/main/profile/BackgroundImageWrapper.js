import { ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

const BackgroundImageWrapper = ({
	uri,
	blur = 5,
	bgColor = "",
	WIDTH = Number(),
	children,
}) => {
	const animatedTranslateY = useSharedValue(20);
	const animatedOpacity = useSharedValue(0);

	const containerReanimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: animatedTranslateY.value }],
		opacity: animatedOpacity.value,
	}));

	function onImageLoadEndHandler() {
		setTimeout(() => {
			animatedTranslateY.value = withTiming(0, {
				duration: 800,
			});
			animatedOpacity.value = withTiming(1, {
				duration: 1000,
				easing: Easing.cubic,
			});
		}, 400);
	}

	return (
		<Animated.View
			style={[styles.container, { width: WIDTH }, containerReanimatedStyle]}
		>
			<ImageBackground
				style={{ flex: 1 }}
				imageStyle={[styles.profileBackground, uri || { opacity: 0 }]}
				source={{ uri: uri }}
				onLoadEnd={onImageLoadEndHandler}
				blurRadius={blur}
				resizeMode="cover"
				resizeMethod="scale"
			>
				<LinearGradient
					colors={["#8E21496D", bgColor]}
					style={styles.backdropGradient}
					start={{
						x: 0,
						y: 0.5,
					}}
					end={{
						x: 0,
						y: 1,
					}}
				>
					{children}
				</LinearGradient>
			</ImageBackground>
		</Animated.View>
	);
};

export default BackgroundImageWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 0.5,
		// zIndex: 1,
		// elevation: 20,
		// shadowColor: "#000000",
		// shadowOffset: { width: 0, height: 5 },
		// shadowOpacity: 1,
		// shadowRadius: 15,
		// overflow: "hidden",
	},
	profileBackground: {
		opacity: 0.8,
	},
	backdropGradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000058",
	},
});

import { useState } from "react";
import {
	Dimensions,
	ImageBackground,
	Pressable,
	StyleSheet,
} from "react-native";

import Animated, {
	useSharedValue,
	withTiming,
	withSpring,
	useAnimatedStyle,
} from "react-native-reanimated";

const ExtraItem = ({ onPress, imgUri, extraEntering }) => {
	const [touched, setTouched] = useState();

	const animatedScale = useSharedValue(0.9);
	const animatedOpacity = useSharedValue(0.8);

	const reanimatedScale = useAnimatedStyle(() => {
		return {
			transform: [{ scale: animatedScale.value }],
			opacity: animatedOpacity.value,
		};
	});

	function scaleHandler() {
		if (touched) return;
		animatedScale.value = withSpring(1.2, { mass: 1 });
		animatedOpacity.value = withTiming(1, { duration: 500 });
		setTouched(true);
		const backToDefaultTimeout = setTimeout(() => {
			animatedScale.value = withSpring(0.9, { mass: 1 });
			animatedOpacity.value = withTiming(0.8, { duration: 500 });
			setTouched(false);
			clearTimeout(backToDefaultTimeout);
		}, 100);
	}

	return (
		<>
			{imgUri && (
				<Animated.View style={[reanimatedScale]} entering={extraEntering}>
					<Pressable
						onPress={() => {
							scaleHandler();
							onPress();
						}}
					>
						<ImageBackground
							style={styles.extraBackgroundContainer}
							imageStyle={styles.extraBackgroundImg}
							source={{ uri: imgUri }}
						/>
					</Pressable>
				</Animated.View>
			)}
		</>
	);
};

export default ExtraItem;

const styles = StyleSheet.create({
	extraBackgroundContainer: {
		height: Dimensions.get("window").width * 0.14,
		width: Dimensions.get("window").width * 0.14,
		marginHorizontal: 4,
	},
	extraBackgroundImg: {},
});

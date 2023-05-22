import { StyleSheet } from "react-native";
import IconButton from "../../../../components/IconButton";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const BORDER_MARGINS = 20;
const ICON_SIZE = 36;

const AddFavorite = ({ onFavPress = () => {}, isFavorite = Boolean() }) => {
	const animatedBackScale = useSharedValue(0);
	const animatedScale = useSharedValue(0);

	const reanimatedBackIconStyle = useAnimatedStyle(() => ({
		transform: [{ scale: animatedBackScale.value }],
	}));
	const reanimatedIconStyle = useAnimatedStyle(() => ({
		transform: [{ scale: animatedScale.value }],
	}));

	useEffect(() => {
		animatedBackScale.value = withTiming(1, { duration: 300 });
	}, []);

	useEffect(() => {
		if (!isFavorite) {
			animatedScale.value = withTiming(1, { duration: 450 });
		}

		if (isFavorite) {
			animatedScale.value = withSequence(
				withTiming(1.4, { duration: 200 }),
				withTiming(0.8, { duration: 200 }),
				withTiming(1.1, { duration: 150 }),
				withTiming(0.9, { duration: 150 }),
				withTiming(1, { duration: 100 })
			);
		}
	}, [isFavorite]);

	const favIcon = isFavorite ? "heart" : "heart-outline";

	return (
		<Animated.View
			style={[
				styles.container,
				{ opacity: isFavorite ? 1 : 0.7 },
				reanimatedBackIconStyle,
			]}
		>
			<IconButton
				style={styles.iconBack}
				icon="heart"
				color="#FFFFFF"
				size={ICON_SIZE * 1.3}
				pressable={false}
			/>
			<Animated.View style={[reanimatedIconStyle]}>
				<IconButton
					style={styles.iconFront}
					icon={favIcon}
					size={ICON_SIZE}
					color="#FF3F3F"
					onPress={onFavPress}
				/>
			</Animated.View>
		</Animated.View>
	);
};

export default AddFavorite;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		right: 0,
		marginRight: BORDER_MARGINS,
		marginTop: BORDER_MARGINS,
		justifyContent: "center",
		alignItems: "center",
		minWidth: ICON_SIZE * 1.4,
		minHeight: ICON_SIZE * 1.4,
	},
	iconBack: {
		padding: 0,
		position: "absolute",
		zIndex: 0,
	},
	iconFront: {
		padding: 0,
		zIndex: 1,
	},
});

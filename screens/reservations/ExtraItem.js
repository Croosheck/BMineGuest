import {
	Dimensions,
	ImageBackground,
	Pressable,
	StyleSheet,
} from "react-native";

const ExtraItem = ({ onPress, imgUri }) => {
	return (
		<Pressable onPress={onPress}>
			<ImageBackground
				style={styles.extraBackgroundContainer}
				imageStyle={styles.extraBackgroundImg}
				source={{ uri: imgUri }}
			/>
		</Pressable>
	);
};

export default ExtraItem;

const styles = StyleSheet.create({
	extraBackgroundContainer: {
		height: Dimensions.get("window").width * 0.15,
		width: Dimensions.get("window").width * 0.15,
		marginHorizontal: 4,
		transform: [{ scale: 0.9 }],
	},
	extraBackgroundImg: {},
});

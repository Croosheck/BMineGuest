import { StyleSheet, ImageBackground } from "react-native";

const ProfileImage = ({ uri = "", WIDTH = Number() }) => {
	return (
		<ImageBackground
			source={{ uri: uri }}
			style={[
				styles.imageContainer,
				{ width: WIDTH * 0.4, borderRadius: WIDTH * 0.2 },
			]}
			imageStyle={styles.image}
			resizeMode="cover"
		/>
	);
};

export default ProfileImage;

const styles = StyleSheet.create({
	imageContainer: {
		aspectRatio: 1,
		transform: [{ translateY: -25 }],
		overflow: "hidden",
	},
	image: {
		transform: [{ scale: 1.2 }, { translateY: 10 }],
	},
});

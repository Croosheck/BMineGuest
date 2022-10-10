import { Image, StyleSheet } from "react-native";

const ImageIcon = ({ source }) => {
	return <Image style={styles.img} source={source} />;
};

export default ImageIcon;

const styles = StyleSheet.create({
	img: {
		width: "100%",
		height: "100%",
	},
});

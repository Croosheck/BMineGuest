import { StyleSheet, View } from "react-native";
import IconButton from "../../../../components/IconButton";

const BORDER_MARGINS = 20;
const ICON_SIZE = 36;

const AddFavorite = ({ onFavPress = () => {}, isFavorite = Boolean() }) => {
	const favIcon = isFavorite ? "heart" : "heart-outline";

	return (
		<View style={[styles.container, { opacity: isFavorite ? 1 : 0.7 }]}>
			<IconButton
				style={styles.iconBack}
				icon="heart"
				color="#FFFFFF"
				size={ICON_SIZE * 1.3}
				pressable={false}
			/>
			<IconButton
				style={styles.iconFront}
				icon={favIcon}
				size={ICON_SIZE}
				color="#FF3F3F"
				onPress={onFavPress}
			/>
		</View>
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

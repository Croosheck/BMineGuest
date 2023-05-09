import { Image, StyleSheet, Text, View } from "react-native";
import { normalizeFontSize } from "../../../../../util/normalizeFontSize";
import IconButton from "../../../../../components/IconButton";

const TopContainer = ({
	restaurantName = "",
	restaurantImageUri = "",
	paddingLeft = Number(),
	onMessagePress = () => {},
	isMessage = Boolean(),
}) => {
	const restaurantTitleDynamicFontSize = restaurantName.length < 22 ? 22 : 18;

	return (
		<View style={styles.container}>
			<Image
				source={{ uri: restaurantImageUri }}
				style={styles.restaurantImage}
				resizeMode="cover"
			/>
			<View style={[styles.restaurantNameBox, { paddingLeft: paddingLeft }]}>
				<Text
					style={[
						styles.restaurantName,
						{ fontSize: normalizeFontSize(restaurantTitleDynamicFontSize) },
					]}
					numberOfLines={1}
				>
					{restaurantName}
				</Text>
				{isMessage && (
					<IconButton
						icon="chatbox"
						onPress={onMessagePress}
						color="#A1BFEB"
						style={styles.iconButton}
					/>
				)}
			</View>
		</View>
	);
};

export default TopContainer;

const styles = StyleSheet.create({
	container: {
		height: "30%",
		marginBottom: 20,
	},
	restaurantImage: {
		flex: 1,
	},
	restaurantNameBox: {
		justifyContent: "space-between",
		paddingVertical: 5,
		borderBottomWidth: 0.5,
		borderColor: "#949494",
		flexDirection: "row",
	},
	restaurantName: {
		fontWeight: "600",
		letterSpacing: 0.3,
	},
	iconButton: {
		margin: 0,
		padding: 0,
		marginRight: 10,
	},
});

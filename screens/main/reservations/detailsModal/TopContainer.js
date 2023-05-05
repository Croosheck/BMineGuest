import { Image, StyleSheet, Text, View } from "react-native";

const TopContainer = ({
	restaurantName = "",
	restaurantImageUri = "",
	paddingLeft = Number(),
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
						{ fontSize: restaurantTitleDynamicFontSize },
					]}
					numberOfLines={1}
				>
					{restaurantName}
				</Text>
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
		justifyContent: "center",
		paddingVertical: 6,
		borderBottomWidth: 0.5,
		borderColor: "#949494",
	},
	restaurantName: {
		fontWeight: "600",
		letterSpacing: 0.3,
	},
});

import { StyleSheet, ScrollView, View, Text, Pressable } from "react-native";
import { memo } from "react";
import { FadeInRight } from "react-native-reanimated";
import { normalizeFontSize } from "../../../../util/normalizeFontSize";
import SectionDivider from "../../../../components/SectionDivider";
import Fav from "./Fav";

const Favs = ({
	WIDTH = Number(),
	favRestaurants = [],
	onFavPress = () => {},
	label = "",
	isMoreData = Boolean(),
	onShowAllFavsPress = () => {},
}) => {
	function displayAllFavsHandler() {
		onShowAllFavsPress();
	}

	return (
		<View style={[styles.container]}>
			<Text style={[styles.label, { fontSize: normalizeFontSize(18) }]}>
				{label}
			</Text>
			<SectionDivider percentageWidth="100%" />
			<ScrollView
				horizontal
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
			>
				{favRestaurants.map((fav, idx) => {
					const img = !fav.url
						? require("../../../../assets/imagePlaceholders/default.jpg")
						: { uri: fav.url };

					return (
						<Fav
							key={fav.name + idx}
							img={img}
							name={fav.name}
							WIDTH={WIDTH}
							data={fav}
							onFavPress={(data) => onFavPress(data)}
							entering={FadeInRight.duration(400)}
						/>
					);
				})}
				{isMoreData && (
					<Pressable
						style={({ pressed }) => [
							styles.allButton,
							pressed && { opacity: 0.7 },
						]}
						onPress={displayAllFavsHandler}
					>
						<Text
							style={[
								styles.allButtonLabel,
								{ fontSize: normalizeFontSize(16) },
							]}
						>
							Show All
						</Text>
					</Pressable>
				)}
			</ScrollView>
		</View>
	);
};

export default memo(Favs);

const styles = StyleSheet.create({
	container: {
		flex: 0.45,
		paddingLeft: 20,
		marginRight: 10,
		width: "100%",
	},
	label: {
		color: "#ffffff",
		fontWeight: "500",
		letterSpacing: 1,
	},
	scroll: {},
	scrollContent: {
		alignItems: "center",
		paddingVertical: 2,
		paddingRight: 10,
		gap: 15,
		minWidth: "100%",
	},
	///////////////
	allButton: {
		flex: 1,
		height: "40%",
		width: 110,

		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: "#FFFFFF17",
	},
	allButtonLabel: {
		color: "#ffffff",
		textShadowColor: "#FFFFFFA4",
		textShadowRadius: 5,
	},
});

import { StyleSheet, ScrollView, View, Text } from "react-native";
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
}) => {
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
				persistentScrollbar={false}
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
							entering={FadeInRight.delay(500).duration(600)}
						/>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default memo(Favs);

const styles = StyleSheet.create({
	container: {
		// borderWidth: 2,
		// borderColor: "#ffffff",
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
	scroll: {
		// borderWidth: 2,
		// borderColor: "#62FF00",
	},
	scrollContent: {
		alignItems: "center",
		paddingVertical: 2,
		gap: 15,
		minWidth: "100%",
		// backgroundColor: "#FF0000",
	},
});

import { Image, ScrollView, StyleSheet, View } from "react-native";

const Gallery = ({
	profileGallery = [""],
	marginLeft = 0,
	width = Number(),
}) => {
	return (
		<View
			style={[styles.restaurantImagesContainer, { marginLeft: marginLeft }]}
		>
			<ScrollView
				style={styles.restaurantImagesScrollViewContainer}
				contentContainerStyle={styles.restaurantImagesScrollViewContent}
				horizontal
			>
				{profileGallery.map((imgUri, i) => {
					return (
						<Image
							key={i}
							style={[styles.restaurantGalleryImage, { width: width }]}
							source={{ uri: imgUri }}
						/>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default Gallery;

const styles = StyleSheet.create({
	restaurantImagesContainer: {
		flex: 0.45,
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	restaurantImagesScrollViewContainer: {},
	restaurantImagesScrollViewContent: {
		borderRadius: 12,
		overflow: "hidden",
	},
	restaurantGalleryImage: {
		height: "100%",
		marginRight: 15,
		borderRadius: 12,
	},
});

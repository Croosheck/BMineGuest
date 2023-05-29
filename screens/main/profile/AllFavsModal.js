import {
	Modal,
	ScrollView,
	StyleSheet,
	View,
	ActivityIndicator,
} from "react-native";
import { FadeInUp } from "react-native-reanimated";
import CloseButton from "../../../components/IconButton";
import Fav from "./favs/Fav";

const AllFavsModal = ({
	data = [],
	onClose = () => {},
	onFavPress = () => {},
	isVisible = Boolean(),
	isLoading = Boolean(),
	WIDTH = Number(),
}) => {
	return (
		<Modal
			visible={isVisible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
			statusBarTranslucent
			hardwareAccelerated
		>
			<View style={styles.modalBackdrop}>
				<View style={styles.modalContainer}>
					<View style={styles.closeModalIconContainer}>
						<CloseButton
							icon="close"
							color="#ffffff"
							size={32}
							style={styles.closeModalIcon}
							onPress={onClose}
						/>
					</View>
					<ScrollView contentContainerStyle={styles.allFavsContent}>
						{isLoading ? (
							<ActivityIndicator size="large" color="#000000" />
						) : (
							data.map((fav, idx) => {
								const img = !fav.url
									? require("../../../assets/imagePlaceholders/default.jpg")
									: { uri: fav.url };

								return (
									<Fav
										key={fav.name + idx}
										img={img}
										name={fav.name}
										WIDTH={WIDTH * 0.8}
										HEIGHT="15%"
										data={fav}
										style={styles.favModal}
										onFavPress={onFavPress}
										entering={FadeInUp.delay(100 * idx).duration(350)}
									/>
								);
							})
						)}
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};

export default AllFavsModal;

const styles = StyleSheet.create({
	modalBackdrop: {
		flex: 1,
		backgroundColor: "#0000007D",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "90%",
		height: "85%",
		maxWidth: 400,
		maxHeight: 700,
		backgroundColor: "#ffffff",
		borderRadius: 10,
		overflow: "hidden",
	},
	closeModalIconContainer: {
		position: "absolute",
		right: 0,
		top: 0,
		zIndex: 2,
		backgroundColor: "#FFFFFF",
		padding: 15,
		borderBottomLeftRadius: 99,
		borderLeftWidth: 15,
		borderColor: "#FFFFFF68",
	},
	closeModalIcon: {
		padding: 0,
		width: 40,
		height: 40,
		backgroundColor: "#251818C2",
		borderRadius: 99,
		borderWidth: 2,
		borderColor: "#ffffff",
		marginLeft: 5,
		transform: [{ translateX: 3 }, { translateY: -3 }],
	},
	allFavsContent: {
		flexGrow: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
		padding: 5,
		paddingVertical: 10,
	},
	favModal: {
		flexGrow: 1,
		minHeight: 100,
	},
});

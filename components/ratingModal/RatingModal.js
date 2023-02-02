import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import ModalButton from "./ModalButton";
import StarRating from "react-native-star-rating-widget";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
const modalSize = {
	x: WIDTH * 0.7,
	y: HEIGHT * 0.3,
};

const RatingModal = ({
	onCloseModal = () => {},
	restaurantName,
	onSubmit = () => {},
	visible,
	rating,
	onChangeRating,
}) => {
	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			onRequestClose={onCloseModal}
		>
			<View style={styles.modalContainer}>
				<View style={styles.innerModalContainer}>
					<Text style={styles.modalRatingTitle}>
						{`How would you rate the service, regarding your reservation details, in ${restaurantName} ?`}
					</Text>
					<View style={styles.modalRatingStarsContainer}>
						<StarRating
							rating={rating}
							onChange={(number) => onChangeRating(number)}
							animationConfig={{
								delay: 0,
								duration: 700,
								scale: 1.3,
							}}
						/>
					</View>
					<View style={styles.modalButtonsContainer}>
						<ModalButton title="CANCEL" onPress={onCloseModal} />
						<ModalButton title="SUBMIT" onPress={onSubmit} />
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default RatingModal;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		width: modalSize.x,
		height: modalSize.y,
		backgroundColor: "#FFFFFF",
		position: "absolute",
		top: HEIGHT * 0.5 - modalSize.y * 0.5,
		left: WIDTH * 0.5 - modalSize.x * 0.5,
		borderRadius: 10,
		overflow: "hidden",
	},
	innerModalContainer: {
		flex: 1,
		paddingHorizontal: 10,
		paddingBottom: 15,
		paddingTop: 5,
	},
	modalRatingTitle: {
		textAlign: "center",
		fontSize: 17,
		fontWeight: "500",
	},
	modalRatingStarsContainer: {
		flex: 1,
		marginVertical: 10,
		// backgroundColor: "#cccccc",
		justifyContent: "center",
		alignItems: "center",
	},
	modalButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
});

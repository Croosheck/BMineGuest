import { StyleSheet, View, Modal } from "react-native";
import CloseButton from "../../../../components/IconButton";
import SectionDivider from "../../../../components/SectionDivider";
import SectionField from "./SectionField";
import TimelineBarSection from "./TimelineBarSection";
import TableSection from "./TableSection";
import ExtrasSection from "./ExtrasSection";
import TopContainer from "./TopContainer";

const MARGIN_LEFT = 20;
const DIVIDER_MARGIN = 20;

const DetailsModal = ({
	modalState = {
		isOpened: false,
	},
	reservationNumber = "###TO DO###",
	restaurantName = "",
	restaurantImageUri = "",
	closeModal = () => {},
	howMany = Number(),
	madeOnTimestamp = Number(),
	reservationDateTimestamp = Number(),
	reservationDate = "",
	table = {},
	extras = [],
	extraImages = {},
	extrasPrice = "",
}) => {
	return (
		<Modal
			visible={modalState.isOpened}
			animationType="fade"
			transparent={true}
			hardwareAccelerated
			onRequestClose={closeModal}
		>
			<View style={styles.modalBackdrop}>
				<View style={styles.modal}>
					<CloseButton
						icon="close"
						color="#ffffff"
						size={32}
						style={styles.closeModalIcon}
						onPress={closeModal}
					/>

					<TopContainer
						restaurantName={restaurantName}
						restaurantImageUri={restaurantImageUri}
						paddingLeft={MARGIN_LEFT}
					/>

					<View style={styles.modalDetails}>
						<View
							style={[styles.modalDetailsSection, styles.modalDetailsFirst]}
						>
							<SectionField
								label="Reservation Number"
								content={reservationNumber}
							/>
							<SectionField label="For" content={howMany} />
						</View>

						<SectionDivider margin={DIVIDER_MARGIN} />

						<View
							style={[styles.modalDetailsSection, styles.modalDetailsSecond]}
						>
							<TimelineBarSection
								madeOnTimestamp={madeOnTimestamp}
								reservationDateTimestamp={reservationDateTimestamp}
								reservationDate={reservationDate}
							/>
						</View>

						<SectionDivider margin={DIVIDER_MARGIN} />

						<View
							style={[styles.modalDetailsSection, styles.modalDetailsThird]}
						>
							<TableSection table={table} />
						</View>

						<SectionDivider margin={DIVIDER_MARGIN} />

						<ExtrasSection extrasPrice={Number(extrasPrice)} extras={extras} />
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default DetailsModal;

const styles = StyleSheet.create({
	modalBackdrop: {
		flex: 1,
		backgroundColor: "#0000009E",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	modal: {
		height: "90%",
		width: "90%",
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		overflow: "hidden",
	},
	closeModalIcon: {
		padding: 0,
		position: "absolute",
		right: 15,
		top: 15,
		width: 40,
		height: 40,
		backgroundColor: "#251818B1",
		borderRadius: 99,
		zIndex: 2,
	},
	////////
	modalDetails: {
		alignItems: "center",
	},
	modalDetailsSection: {
		width: "100%",
		maxHeight: "30%",
		flexDirection: "row",
		marginLeft: MARGIN_LEFT,
		position: "relative",
	},
	modalDetailsFirst: {},
	modalDetailsSecond: {
		flexDirection: "column",
		marginLeft: 0,
	},
	modalDetailsThird: {},
});

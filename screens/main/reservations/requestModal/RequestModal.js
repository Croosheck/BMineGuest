import {
	Dimensions,
	KeyboardAvoidingView,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import ModalButton from "../ratingModal/ModalButton";
import { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
const modalSize = {
	x: WIDTH * 0.75,
	y: HEIGHT * 0.5,
};
const CONTAINER_PADDING = {
	HORIZONTAL: 10,
	BOTTOM: 10,
	TOP: 5,
};
const BUTTON_WIDTH = 100;
const MESSAGE_MAX_LENGTH = 200;

const RequestModal = ({
	onCloseModal = () => {},
	onSubmit = ({ requestMessage = "", request = "" }) => {},
	visible = Boolean(),
}) => {
	const [message, setMessage] = useState("");
	const [selectedRequest, setSelectedRequest] = useState(String());
	const [requestError, setRequestError] = useState(false);
	const [currentMessageLength, setCurrentMessageLength] = useState(0);

	const pickerRef = useRef();

	function resetRequestData() {
		setMessage("");
		setSelectedRequest();
		setCurrentMessageLength(0);
		setRequestError(false);
	}

	function requestErrorHandler() {
		setRequestError(true);

		setTimeout(() => setRequestError(false), 2000);
	}

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="fade"
			hardwareAccelerated
			onRequestClose={onCloseModal}
			statusBarTranslucent
		>
			<View style={{ flex: 1, backgroundColor: "#00000075" }}>
				<KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
					<View style={styles.innerModalContainer}>
						<Text style={styles.modalRatingTitle}>
							{`Specify your request and type in some details, so we will be able to provide the best service for you!`}
						</Text>
						<View style={styles.modalDataContainer}>
							<View style={styles.requestTypeContainer}>
								<Picker
									selectedValue={selectedRequest}
									onValueChange={(itemValue) => setSelectedRequest(itemValue)}
									prompt="Select your request:"
									style={[
										styles.requestPicker,
										requestError && styles.requestPickerError,
									]}
									ref={pickerRef}
								>
									<Picker.Item
										label="Choose request type..."
										enabled={false}
										color="#A3A3A3"
									/>
									<Picker.Item label="Cancel Request" value="cancellation" />
								</Picker>
							</View>
							<View style={styles.textInputContainer}>
								<TextInput
									style={styles.textInput}
									placeholder="Message... (optional)"
									maxLength={MESSAGE_MAX_LENGTH}
									onChangeText={(value) => {
										setMessage(value);
										setCurrentMessageLength(value.length);
									}}
									value={message}
								/>
								<Text
									style={styles.textInputLimit}
								>{`${currentMessageLength}/${MESSAGE_MAX_LENGTH}`}</Text>
							</View>
						</View>
						<View style={styles.modalButtonsContainer}>
							<View style={styles.buttonCancel}>
								<ModalButton
									title="CANCEL"
									onPress={() => {
										onCloseModal();

										resetRequestData();
									}}
									buttonWidth={BUTTON_WIDTH}
								/>
							</View>
							<View style={styles.buttonSubmit}>
								<ModalButton
									title="SUBMIT"
									onPress={() => {
										if (!selectedRequest) {
											requestErrorHandler();
											pickerRef.current.focus();
											return;
										}
										onSubmit({
											requestMessage: message,
											request: selectedRequest,
										});

										resetRequestData();
									}}
									buttonWidth={BUTTON_WIDTH}
								/>
							</View>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
};

export default RequestModal;

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
		paddingHorizontal: CONTAINER_PADDING.HORIZONTAL,
		paddingBottom: CONTAINER_PADDING.BOTTOM,
		paddingTop: CONTAINER_PADDING.TOP,
	},
	modalRatingTitle: {
		textAlign: "center",
		fontSize: 18,
		fontWeight: "500",
	},
	modalDataContainer: {
		flex: 0.8,
		// backgroundColor: "#cccccc",
		marginVertical: 10,
	},
	requestTypeContainer: {
		flex: 0.3,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	requestPicker: {
		width: "100%",
		backgroundColor: "#EAEAEA",
	},
	requestPickerError: {
		backgroundColor: "#FF4E4E",
		color: "#ffffff",
	},
	requestButton: {
		backgroundColor: "#7DC0FF",
		height: "50%",
		minWidth: "30%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	requestButtonText: {
		fontWeight: "500",
		fontSize: 16,
	},
	textInputContainer: {
		flex: 0.7,
		backgroundColor: "#E4E4E4",
		borderRadius: 10,
		overflow: "hidden",
	},
	textInput: {
		padding: 10,
		paddingBottom: 20,
		fontSize: 16,
	},
	textInputLimit: {
		position: "absolute",
		bottom: 0,
		right: 0,
		marginRight: 5,
		marginBottom: 2,
	},
	modalButtonsContainer: {
		flex: 0.2,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	buttonCancel: {},
	buttonSubmit: {},
});

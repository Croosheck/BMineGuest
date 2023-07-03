import { StyleSheet } from "react-native";
import IconButton from "../../../components/IconButton";
import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { ActivityIndicator } from "react-native";

const LogoutButton = ({ onPress = () => {}, isReady = Boolean() }) => {
	return (
		<View style={styles.button}>
			{isReady ? (
				<Animated.View entering={FadeInRight.duration(700)}>
					<IconButton
						style={styles.icon}
						onPress={onPress}
						icon="md-exit-outline"
						color="#ffffff"
						size={36}
						label="Logout"
						labelSize={10}
						labelColor="#ffffff"
						labelStyle={{
							transform: [{ translateX: -3 }, { translateY: -4 }],
							textTransform: "uppercase",
							fontWeight: "300",
						}}
					/>
				</Animated.View>
			) : (
				<ActivityIndicator color="#9FC8FB" size="small" />
			)}
		</View>
	);
};

export default LogoutButton;

const styles = StyleSheet.create({
	button: {
		position: "absolute",
		top: 0,
		right: 0,
		marginRight: 20,
		marginTop: 20,
		minWidth: 50,
	},
	icon: {
		padding: 0,
	},
});

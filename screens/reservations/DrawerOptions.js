import { StyleSheet, View } from "react-native";
import ReservationDrawerButton from "../../components/ReservationDrawerButton";

const DrawerOptions = ({
	width,
	buttonCornerRadius,
	buttonsData,
	animatedScale,
	buttonAnimatedScale,
	textCenteringMargin,
}) => {
	return (
		<View style={[styles.container, { width: width }]}>
			<View style={styles.innerContainer}>
				{buttonsData.map((button, i) => {
					return (
						<ReservationDrawerButton
							key={i}
							title={button.title}
							isFirst={i === 0 ? true : false}
							isLast={i === buttonsData.length - 1 ? true : false}
							cornerRadius={buttonCornerRadius}
							animatedScale={animatedScale}
							buttonAnimatedScale={buttonAnimatedScale}
							onPress={button.onPress}
							textCenteringMargin={textCenteringMargin}
						/>
					);
				})}
			</View>
		</View>
	);
};

export default DrawerOptions;

const styles = StyleSheet.create({
	container: {
		// backgroundColor: "#B3FF0020",
		height: "100%",
		zIndex: 1,
		position: "absolute",
		right: 0,
		paddingVertical: 3,
	},
	innerContainer: {
		flex: 1,
	},
});

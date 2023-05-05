import { StyleSheet, View } from "react-native";
import ReservationDrawerButton from "../../../../components/ReservationDrawerButton";

const DrawerOptions = ({
	width,
	buttonCornerRadius,
	buttonsData,
	animatedScale,
	buttonAnimatedScale,
	textCenteringMargin,
	buttonsQuantity = 3,
}) => {
	const emptyArr = [];

	if (!buttonsData) {
		//default blank buttons
		function newArray(arr) {
			for (let i = 0; i < buttonsQuantity; i++) {
				arr.push({
					title: `Button ${i + 1}`,
					onPress: () => console.log("Pressed"),
				});
			}
		}

		newArray(emptyArr);
	}

	const data = !!buttonsData ? buttonsData : emptyArr;

	return (
		<View style={[styles.container, { width: width }]}>
			<View style={styles.innerContainer}>
				{data.map((button, i) => {
					return (
						<ReservationDrawerButton
							key={i}
							title={button.title}
							isFirst={i === 0 ? true : false}
							isLast={i === data.length - 1 ? true : false}
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

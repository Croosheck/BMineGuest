import { StyleSheet, Text, ImageBackground, Pressable } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { normalizeFontSize } from "../../../../util/normalizeFontSize";

const Fav = ({
	img,
	WIDTH = Number(),
	HEIGHT,
	data = {},
	onFavPress = () => {},
	entering,
	style = {},
}) => {
	return (
		<Animated.View
			style={[
				styles.container,
				{ width: WIDTH * 0.5 },
				HEIGHT && { height: HEIGHT },
				style,
			]}
			entering={entering}
		>
			<Pressable style={{ flex: 1 }} onPress={onFavPress.bind(this, data)}>
				<ImageBackground
					source={img}
					style={styles.background}
					resizeMode="cover"
					resizeMethod="scale"
				>
					<LinearGradient
						style={styles.nameGradient}
						colors={["#000000A7", "#686868BE", "#FFFFFF96"]}
						start={{
							x: 0.3,
							y: 0.5,
						}}
						end={{
							x: 1,
							y: 0.5,
						}}
					>
						<Text
							style={[
								styles.name,
								{
									fontSize: normalizeFontSize(15),
									lineHeight: normalizeFontSize(25),
								},
							]}
						>
							{data.name}
						</Text>
					</LinearGradient>
				</ImageBackground>
			</Pressable>
		</Animated.View>
	);
};

export default memo(Fav);

const styles = StyleSheet.create({
	container: {
		borderWidth: 2,
		borderColor: "#FFFFFF3E",
		borderRadius: 20,
		overflow: "hidden",
		position: "relative",
	},
	background: {
		flex: 1,
	},
	nameGradient: {
		width: "100%",
		position: "absolute",
		bottom: 5,
		paddingLeft: 10,
	},
	name: {
		color: "#ffffff",
		textShadowColor: "#000000",
		textShadowRadius: 5,
	},
});

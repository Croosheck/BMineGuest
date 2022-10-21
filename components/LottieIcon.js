import LottieView from "lottie-react-native";

const LottieIcon = ({
	source,
	progress,
	width,
	height,
	transform,
	colorFilters,
	loop,
	autoPlay,
}) => {
	return (
		<LottieView
			source={source}
			progress={progress}
			style={{
				width: width,
				height: height,
				backgroundColor: "transparent",
				transform: transform,
				justifyContent: "center",
				alignItems: "center",
			}}
			colorFilters={colorFilters}
			loop={loop}
			autoPlay={autoPlay}
		/>
	);
};

export default LottieIcon;

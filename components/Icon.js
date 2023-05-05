import { MaterialCommunityIcons } from "@expo/vector-icons";

const Icon = ({ name = "", color = "#ffffff", size = 24, style = {} }) => {
	return (
		<MaterialCommunityIcons
			name={name}
			size={size}
			color={color}
			style={style}
		/>
	);
};

export default Icon;

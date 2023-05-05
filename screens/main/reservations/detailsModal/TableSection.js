import { Image, StyleSheet, View } from "react-native";
import SectionField from "./SectionField";

const TableSection = ({ table = {} }) => {
	return (
		<View style={styles.container}>
			<SectionField
				label="Placement"
				content={table.tPlacement}
				style={{ flex: 0 }}
			/>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: table.tImage }}
					style={styles.tableImage}
					resizeMode="cover"
				/>
			</View>
		</View>
	);
};

export default TableSection;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		gap: 50,
	},
	imageContainer: {
		alignItems: "center",
		justifyContent: "center",
		maxWidth: "40%",
		borderRadius: 10,
		overflow: "hidden",
		borderWidth: 1,
	},
	tableImage: {
		width: "100%",
		aspectRatio: 1,
		maxHeight: 150,
	},
});

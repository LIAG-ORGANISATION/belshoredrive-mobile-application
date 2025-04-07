import Svg, { Path, Rect, type SvgProps } from "react-native-svg";

export const CropView = ({ ...props }: SvgProps & { onPress: () => void }) => {
	return (
		<Svg width={374} height={369} viewBox="0 0 374 369" fill="none">
			<Rect
				x={80}
				y={17.5}
				width={214}
				height={334}
				rx={8}
				stroke="#fff"
				strokeWidth={3}
				strokeDasharray="4 4"
			/>
			<Path
				opacity={0.6}
				fillRule="evenodd"
				clipRule="evenodd"
				d="M374 0H0v369h374V0zM88.453 18.124a8 8 0 00-8 8v316.752a8 8 0 008 8h197.093a8 8 0 008-8V26.124a8 8 0 00-8-8H88.453z"
				fill="#1F1F1F"
				fillOpacity={0.8}
			/>
		</Svg>
	);
};

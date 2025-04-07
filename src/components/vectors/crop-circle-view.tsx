import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

export const CropCircleView = ({
	...props
}: SvgProps & { onPress: () => void }) => {
	return (
		<Svg viewBox="0 0 375 375" fill="none" {...props}>
			<Path
				opacity={0.6}
				fillRule="evenodd"
				clipRule="evenodd"
				d="M375 0H0v375h375V0zM187.5 367c99.135 0 179.5-80.365 179.5-179.5S286.635 8 187.5 8 8 88.365 8 187.5 88.365 367 187.5 367z"
				fill="#000"
			/>
			<Circle cx={187.5} cy={187.5} r={179} stroke="#fff" />
		</Svg>
	);
};

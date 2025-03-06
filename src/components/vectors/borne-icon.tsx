import Svg, { Path, type SvgProps } from "react-native-svg";

export const BorneIcon = (props: SvgProps) => {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<Path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12 2C7.58172 2 4 5.58172 4 10V11V21H1C0.447715 21 0 21.4477 0 22C0 22.5523 0.447715 23 1 23H4H20H23C23.5523 23 24 22.5523 24 22C24 21.4477 23.5523 21 23 21H20V11V10C20 5.58172 16.4183 2 12 2ZM18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10H18ZM6 12H18V21H6V12Z"
				fill="#545454"
			/>
		</Svg>
	);
};

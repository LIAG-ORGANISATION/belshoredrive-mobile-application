import Svg, {
	ClipPath,
	Defs,
	G,
	Path,
	Rect,
	type SvgProps,
} from "react-native-svg";

export const DirectMessageIcon = (props: SvgProps) => {
	return (
		<Svg
			width={props.width || "24"}
			height={props.height || "24"}
			viewBox="0 0 24 24"
			fill="none"
			{...props}
		>
			<G clip-path="url(#clip0_12179_4830)">
				<Path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M22.0711 1.92911C22.3389 2.19694 22.4324 2.59311 22.3127 2.95244L15.9487 22.0443C15.8267 22.4103 15.5051 22.6735 15.1222 22.7206C14.7393 22.7677 14.3635 22.5904 14.1563 22.265L9.3259 14.6743L1.73521 9.84383C1.40975 9.63672 1.23244 9.26087 1.27958 8.87799C1.32671 8.49511 1.58988 8.17348 1.95586 8.05149L21.0477 1.68753C21.4071 1.56775 21.8032 1.66127 22.0711 1.92911ZM11.3246 14.0898L14.7157 19.4187L19.7828 4.21735L4.58147 9.28447L9.91037 12.6756L15 7.58596C15.3905 7.19544 16.0237 7.19544 16.4142 7.58596C16.8047 7.97649 16.8047 8.60965 16.4142 9.00017L11.3246 14.0898Z"
					fill={props.fill || "white"}
				/>
			</G>
			<Defs>
				<ClipPath id="clip0_12179_4830">
					<Rect width="24" height="24" fill={props.fill || "white"} />
				</ClipPath>
			</Defs>
		</Svg>
	);
};

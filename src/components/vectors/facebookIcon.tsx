import Svg, {
	ClipPath,
	Defs,
	G,
	Path,
	Rect,
	type SvgProps,
} from "react-native-svg";

export const FacebookIcon = (props: SvgProps) => {
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
			<G clip-path="url(#clip0_12777_6640)">
				<Path
					d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
					fill="#757575"
				/>
			</G>
			<Defs>
				<ClipPath id="clip0_12777_6640">
					<Rect width="24" height="24" fill="white" />
				</ClipPath>
			</Defs>
		</Svg>
	);
};

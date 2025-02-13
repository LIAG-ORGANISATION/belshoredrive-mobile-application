import Svg, {
  Defs,
  G,
  Path,
  Rect,
  ClipPath,
  type SvgProps,
} from "react-native-svg";

export const ShareIcon = (props: SvgProps) => {
  return (
    <Svg width="17" height="16" viewBox="0 0 17 16" fill="none" {...props}>
      <G clip-path="url(#clip0_12909_8800)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.964 1.28607C15.1426 1.46463 15.205 1.72874 15.1251 1.96829L10.8825 14.6962C10.8011 14.9402 10.5867 15.1156 10.3315 15.1471C10.0762 15.1785 9.82564 15.0603 9.68756 14.8433L6.46727 9.78285L1.40681 6.56256C1.18983 6.42448 1.07163 6.17392 1.10305 5.91866C1.13447 5.66341 1.30992 5.44899 1.5539 5.36766L14.2818 1.12502C14.5214 1.04517 14.7855 1.10752 14.964 1.28607ZM7.79972 9.39321L10.0605 12.9458L13.4386 2.81157L3.30431 6.18965L6.85692 8.4504L10.25 5.05731C10.5104 4.79696 10.9325 4.79696 11.1928 5.05731C11.4532 5.31766 11.4532 5.73977 11.1928 6.00012L7.79972 9.39321Z"
          fill="#757575"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_12909_8800">
          <Rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0.25)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

import Svg, { Path, Rect, type SvgProps } from "react-native-svg";

export const CopyIcon = (props: SvgProps) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <Rect x="4" y="2" width="12" height="15" rx="1" fill="#757575" />
      <Path
        d="M20 6V19C20 20.1046 19.1046 21 18 21H8"
        stroke="#757575"
        stroke-width="2"
        stroke-linecap="round"
      />
    </Svg>
  );
};

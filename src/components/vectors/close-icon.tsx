import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

export const CloseIcon = (props: SvgProps) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx="12" cy="12" r="10" fill={props.fill || "white"} />
      <Path
        d="M15 9L9 15"
        stroke="#1F1F1F"
        stroke-width="2"
        stroke-linecap="round"
      />
      <Path
        d="M15 15L9 9"
        stroke="#1F1F1F"
        stroke-width="2"
        stroke-linecap="round"
      />
    </Svg>
  );
};

import * as React from "react";
import Svg, { type SvgProps, Path } from "react-native-svg";

export const TikTokIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#757575"
      d="M17.073 0h-4.045v16.348c0 1.948-1.556 3.548-3.492 3.548s-3.491-1.6-3.491-3.548c0-1.913 1.52-3.478 3.388-3.548V8.696C5.319 8.766 2 12.139 2 16.348 2 20.59 5.388 24 9.57 24c4.184 0 7.572-3.444 7.572-7.652V7.965A9.366 9.366 0 0 0 22.5 9.774V5.67c-3.042-.105-5.427-2.61-5.427-5.67Z"
    />
  </Svg>
);

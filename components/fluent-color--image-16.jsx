import React from 'react';
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

const ImageIcons = (props) => (
  <Svg
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 16 16"
    fill="none"
  >
    <Defs>
      <LinearGradient
        id="fluentColorImage160"
        x1={6.286}
        y1={7.997}
        x2={7.572}
        y2={14.347}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#b3e0ff" />
        <Stop offset="1" stopColor="#8cd0ff" />
      </LinearGradient>
      <LinearGradient
        id="fluentColorImage161"
        x1={10.097}
        y1={4.277}
        x2={10.829}
        y2={6.913}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#fdfdfd" />
        <Stop offset="1" stopColor="#b3e0ff" />
      </LinearGradient>
      <RadialGradient
        id="fluentColorImage162"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(20.57146 26.03575 -23.68122 18.71109 -2.714 -4.75)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0.338" stopColor="#0fafff" />
        <Stop offset="0.529" stopColor="#367af2" />
      </RadialGradient>
    </Defs>
    <G fill="none">
      <Path fill="url(#fluentColorImage162)" d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5z" />
      <Path fill="url(#fluentColorImage160)" d="M13.586 12.879A2.5 2.5 0 0 1 11.5 14h-7a2.5 2.5 0 0 1-2.086-1.121l4.384-4.384a1.7 1.7 0 0 1 2.404 0z" />
      <Path fill="url(#fluentColorImage161)" d="M11.5 5.502a1.002 1.002 0 1 1-2.004 0 1.002 1.002 0 0 1 2.004 0" />
    </G>
  </Svg>
);

export default ImageIcons;

import React from 'react';
import Svg, { G, Path, Circle } from 'react-native-svg';

const AudioIcon = (props) => (
  <Svg
    width={props.size || 48}
    height={props.size || 48}
    viewBox="0 0 48 48"
    fill="none"
  >
    <G
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
    >
      <Path fill="#2f88ff" stroke="#000" d="M8 44V4H31L40 14.5V44H8Z" />
      <Path stroke="#fff" d="M32 14L26 16.9688V31.5" />
      <Circle cx={20.5} cy={31.5} r={5.5} fill="#43ccf8" stroke="#fff" />
    </G>
  </Svg>
);

export default AudioIcon;

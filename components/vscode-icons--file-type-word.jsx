import React from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const WordIcons = (props) => (
  <Svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 32 32"
    fill="none"
  >
    <Defs>
      <LinearGradient
        id="vscodeIconsFileTypeWord0"
        x1={4.494}
        y1={-1712.086}
        x2={13.832}
        y2={-1695.914}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(0 1720)"
      >
        <Stop offset="0" stopColor="#2368c4" />
        <Stop offset="0.5" stopColor="#1a5dbe" />
        <Stop offset="1" stopColor="#1146ac" />
      </LinearGradient>
    </Defs>
    <Path fill="#41a5ee" d="M28.806 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5l11.069 3.25L30 9.5V4.191A1.19 1.19 0 0 0 28.806 3" />
    <Path fill="#2b7cd3" d="M30 9.5H8.512V16l11.069 1.95L30 16Z" />
    <Path fill="#185abd" d="M8.512 16v6.5l10.418 1.3L30 22.5V16Z" />
    <Path fill="#103f91" d="M9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5H8.512v5.309A1.19 1.19 0 0 0 9.705 29" />
    <Path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity="0.1" />
    <Path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2" />
    <Path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2" />
    <Path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2" />
    <Path fill="url(#vscodeIconsFileTypeWord0)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85" />
    <Path fill="#fff" d="M6.9 17.988q.035.276.046.481h.028q.015-.195.065-.47c.05-.275.062-.338.089-.465l1.255-5.407h1.624l1.3 5.326a8 8 0 0 1 .162 1h.022a8 8 0 0 1 .135-.975l1.039-5.358h1.477l-1.824 7.748h-1.727l-1.237-5.126q-.054-.222-.122-.578t-.084-.52h-.021q-.021.189-.084.561t-.1.552L7.78 19.871H6.024L4.19 12.127h1.5l1.131 5.418a5 5 0 0 1 .079.443" />
  </Svg>
);

export default WordIcons;

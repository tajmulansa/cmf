import {loadFont} from '@remotion/google-fonts/Poppins';

// All look-and-feel lives here so refining the style later is a one-file change.
export const {fontFamily} = loadFont('normal', {weights: ['500', '700'], subsets: ['latin']});

export const C = {
  bg: '#0b1020',
  bg2: '#05081a',
  panel: '#182042',
  amber: '#ffb703',
  teal: '#2ec4b6',
  ice: '#bee6ff',
  white: '#f5f7fc',
  muted: '#6e7caa',
};

export const SAFE_BOTTOM = 330; // YouTube Shorts UI covers the bottom of the frame

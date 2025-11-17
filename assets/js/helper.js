// helper.js
// Generate random string (for variable number of characters)
export const randomString = (length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-') => {
  let result = '';

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

// Format date in `yyyy-mm-dd` format
export const formatDate = (date, format = 'normal') => {
  const year = date.getFullYear();
  // Months are 0-indexed, so add 1 and pad with a leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // Pad day with a leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0');

  return format === 'normal' ? `${year}-${month}-${day}` : `${day}/${month}`;
};

// Get current tab
export const getCurrentTab = async function () {
  const queryOptions = { active: true };

  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

// Debounce function to prevent duplicate triggers
export const debounce = function (callback, delay = 800) {
  let timeout;

  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), delay);
  };
};

// Wrapper for the random string function
export const generateId = function () {
  return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

/**
 * Color conversion from hex to (rgb & hsl)
 * @see https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
 */
// HEX to RGB conversion
export const hexToRgb = hex => {
  let alpha = false,
    h = hex.slice(hex.startsWith('#') ? 1 : 0);
  if (h.length === 3) h = [...h].map(x => x + x).join('');

  h = parseInt(h, 16);
  return (
    (h >>> (alpha ? 24 : 16)) +
    ',' +
    ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
    ',' +
    ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0))
  );
};

// RGB to HSL conversion
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

// Build shadow CSS value from provided inputs
export const getShadowCSSValue = (type, color, direction, offset, thickness, opacity) => {
  // Default for `center` position
  let output = `0 0`;

  switch (direction) {
    case 'up':
      output = `0 -${offset}px`;
      break;
    case 'down':
      output = `0 ${offset}px`;
      break;
    case 'left':
      output = `-${offset}px 0`;
      break;
    case 'right':
      output = `${offset}px 0`;
      break;
    case 'up-left':
      output = `-${offset}px -${offset}px`;
      break;
    case 'up-right':
      output = `${offset}px -${offset}px`;
      break;
    case 'down-left':
      output = `-${offset}px ${offset}px`;
      break;
    case 'down-right':
      output = `${offset}px ${offset}px`;
      break;
  };

  // Now, based on shadow type, add the next two parameters
  output += type === 'subtle' ? ` ${thickness}px ${thickness/2}px` : ` 0 ${thickness}px`;

  // Lastly, add color with opacity
  output += ` rgba(${hexToRgb(color)},${opacity})`;

  return output;
};

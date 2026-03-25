import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base design dimensions (iPhone 14 / 390×844)
export const BASE_WIDTH = 390;
export const BASE_HEIGHT = 844;

/**
 * Horizontal scale — use for widths, horizontal padding/margin, fixed widths.
 */
export function s(size: number): number {
  return Math.round(
    PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size),
  );
}

/**
 * Vertical scale — use for heights, vertical padding/margin, fixed heights.
 */
export function vs(size: number): number {
  return Math.round(
    PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size),
  );
}

/**
 * Moderate scale — use for font sizes and elements that should scale
 * but not as aggressively. factor 0 = no scale, factor 1 = full scale.
 */
export function ms(size: number, factor = 0.4): number {
  return Math.round(
    PixelRatio.roundToNearestPixel(size + (s(size) - size) * factor),
  );
}

/** Percentage of screen width */
export function wp(percentage: number): number {
  return (SCREEN_WIDTH * percentage) / 100;
}

/** Percentage of screen height */
export function hp(percentage: number): number {
  return (SCREEN_HEIGHT * percentage) / 100;
}

export { SCREEN_HEIGHT, SCREEN_WIDTH };

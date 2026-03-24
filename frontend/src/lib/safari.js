/**
 * Safari detection and performance utilities.
 * Used across canvas components to reduce load on WebKit browsers.
 */

const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

export const isSafari =
  /^((?!chrome|android).)*safari/i.test(ua) ||
  (/iPad|iPhone|iPod/.test(ua) && !window.MSStream);

export const isMobile =
  /iPhone|iPad|iPod|Android/i.test(ua) ||
  (typeof window !== "undefined" && window.innerWidth < 768);

// Safari + mobile = most constrained
export const isLowPerf = isSafari && isMobile;

/**
 * Returns reduced particle counts for Safari.
 * @param {number} normal - Count for Chrome/Firefox
 * @param {number} safari - Reduced count for Safari desktop
 * @param {number} mobile - Minimal count for mobile Safari
 */
export function safariCount(normal, safari, mobile) {
  if (isLowPerf) return mobile;
  if (isSafari) return safari;
  return normal;
}

/**
 * Returns a frame throttle interval (ms).
 * Safari gets a slower tick to avoid overwhelming the GPU.
 */
export function safariThrottle(normalMs, safariMs) {
  if (isSafari) return safariMs || normalMs * 1.5;
  return normalMs;
}

export const FRAME_COUNT = 9;

/** The league's real paper scoresheet is fixed: 6 singles frames then 3
 * doubles frames, no decider — so the frame type is never a choice the
 * admin needs to make. */
export function frameTypeForNumber(frameNumber: number): "singles" | "doubles" {
  return frameNumber <= 6 ? "singles" : "doubles";
}

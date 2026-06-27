export const RingStatus = {
  Searching: 'searching',
  Aligning: 'aligning',
  Locked: 'locked',
} as const
export type RingStatus = (typeof RingStatus)[keyof typeof RingStatus]

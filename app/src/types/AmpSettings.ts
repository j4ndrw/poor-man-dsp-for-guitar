export const effectNames = [
    "Transpose",
    "Volume",
    "Gain",
    "Low",
    "Mid",
    "High",
    "Delay",
    "Reverb",
    "Distortion",
] as const;
export type EffectName = typeof effectNames[number];

export type AmpSetting<T> = {
    value: T;
};

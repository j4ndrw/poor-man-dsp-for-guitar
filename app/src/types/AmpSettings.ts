export const effectNames = [
    "Gain",
    "Low",
    "Mid",
    "High",
    "Distortion",
    "Delay",
    "Chorus",
    "Reverb",
] as const;
export type EffectName = typeof effectNames[number];

export type AmpSetting<T> = {
    value: T;
};

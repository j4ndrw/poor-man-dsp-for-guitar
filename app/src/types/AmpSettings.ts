export const effectNames = [
    "Gain",
    "Low",
    "Mid",
    "High",
    "Chorus",
    "Delay",
    "Reverb",
    "Distortion",
] as const;
export type EffectName = typeof effectNames[number];

export type AmpSetting<T> = {
    value: T;
};

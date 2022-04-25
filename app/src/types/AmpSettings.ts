import { Accessor } from "solid-js";

export type KnobName =
    | "Transpose"
    | "Volume"
    | "Gain"
    | "Low"
    | "Mid"
    | "High"
    | "Delay"
    | "Reverb"
    | "Distortion";

export type AmpSetting<T> = {
    value: T;
};

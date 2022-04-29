import { ClickableKnob, TurnableKnob } from "@/components/knob";
import SliderKnob from "@/components/knob/slider/SliderKnob";
import { setStore } from "@/store/store";
import { createMemo } from "solid-js";

const RangedKnob =
    navigator.userAgent.indexOf("Firefox") !== -1 ? SliderKnob : TurnableKnob;

export const createAmp = createMemo(
    () =>
        ({ disabled }: { disabled?: boolean }) =>
            [
                () => (
                    <RangedKnob
                        disabled={disabled}
                        name="Gain"
                        min={0}
                        max={100}
                    />
                ),
                () => (
                    <RangedKnob
                        disabled={disabled}
                        name="Low"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                    />
                ),
                () => (
                    <RangedKnob
                        disabled={disabled}
                        name="Mid"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                    />
                ),
                () => (
                    <RangedKnob
                        disabled={disabled}
                        name="High"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                    />
                ),
                () => (
                    <RangedKnob
                        disabled={disabled}
                        name="Distortion"
                        min={0}
                        max={100}
                    />
                ),
                () => (
                    <RangedKnob
                        disabled={disabled}
                        name="Delay"
                        min={0}
                        max={100}
                    />
                ),
                () => <ClickableKnob disabled={disabled} name="Chorus" />,
                () => <ClickableKnob disabled={disabled} name="Reverb" />,
            ]
);

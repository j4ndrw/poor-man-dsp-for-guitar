import { ClickableKnob, TurnableKnob } from "@/components/knob";
import { setStore } from "@/store/store";
import { createMemo } from "solid-js";

export const createAmp = createMemo(
    () =>
        ({ disabled }: { disabled?: boolean }) =>
            [
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Gain"
                        min={0}
                        max={100}
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Low"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Mid"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="High"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Distortion"
                        min={0}
                        max={100}
                    />
                ),
                () => (
                    <TurnableKnob
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

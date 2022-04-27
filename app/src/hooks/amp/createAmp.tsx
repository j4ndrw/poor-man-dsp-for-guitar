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
                        onTurn={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Low"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                        onTurn={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Mid"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                        onTurn={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="High"
                        min={0}
                        max={100}
                        defaultKnobPosition="middle"
                        onTurn={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => <ClickableKnob disabled={disabled} name="Chorus" />,
                () => <ClickableKnob disabled={disabled} name="Delay" />,
                () => <ClickableKnob disabled={disabled} name="Reverb" />,
                () => <ClickableKnob disabled={disabled} name="Distortion" />,
            ]
);

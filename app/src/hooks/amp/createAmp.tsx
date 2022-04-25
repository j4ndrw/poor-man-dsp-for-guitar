import { ClickableKnob, TurnableKnob } from "@components/knob";
import { createMemo } from "solid-js";

export const createAmp = createMemo(
    () =>
        ({ disabled }: { disabled?: boolean }) =>
            [
                () => (
                    <TurnableKnob
                        disabled={disabled}
                        name="Transpose"
                        min={-12}
                        max={12}
                        onTurn={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
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
                        onTurn={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <ClickableKnob
                        disabled={disabled}
                        name="Delay"
                        onClick={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <ClickableKnob
                        disabled={disabled}
                        name="Reverb"
                        onClick={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <ClickableKnob
                        disabled={disabled}
                        name="Distortion"
                        onClick={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
                () => (
                    <ClickableKnob
                        disabled={disabled}
                        name="Other"
                        onClick={() => {
                            /* TODO: Implement this */
                        }}
                    />
                ),
            ]
);

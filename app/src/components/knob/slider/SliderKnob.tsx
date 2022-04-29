import { createMemo, createSignal, createEffect, onMount } from "solid-js";
import KnobBase from "../KnobBase";
import type { KnobBaseProps } from "@/interfaces/KnobBaseProps";

import { store, setStore, initialStoreState } from "@/store/store";

interface Boundaries {
    upper: number;
    lower: number;
}
interface Props extends KnobBaseProps {
    min: number;
    max: number;
    defaultKnobPosition?: "start" | "middle";
    onTurn?: (currentValue: number) => void;
}

function SliderKnob(props: Props) {
    const {
        min,
        max,
        defaultKnobPosition = "start",
        name,
        onTurn,
        disabled,
    } = props;

    const turnKnob = ({}: {
        knobPosition: number;
        boundaries: Boundaries;
    }) => {};

    createEffect(() => {
        if (onTurn) onTurn(store()[name].value as number);
    });

    if (min >= max)
        throw new Error(
            "The minimum value must be less than the maximum value"
        );

    return (
        <div class="pt-1 flex flex-col justify-center items-center">
            <input
                class="w-40 transform -translate-y-12 -rotate-90"
                type="range"
                min={min}
                max={max}
                value={store()[name].value as number}
                step={1}
                onChange={(event) => {
                    setStore({
                        ...store(),
                        [name]: { value: event.currentTarget.value },
                    });
                }}
                id="knob"
            />
            <label
                for="knob"
                class="transform translate-y-6 text-lg select-none"
            >
                {name}
            </label>
        </div>
    );
}

export default SliderKnob;

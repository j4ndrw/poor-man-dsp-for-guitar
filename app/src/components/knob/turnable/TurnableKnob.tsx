import { createEffect, createMemo, createSignal, JSX } from "solid-js";
import KnobBase from "../KnobBase";
import type { KnobBaseProps } from "@interfaces/KnobBaseProps";

import "./TurnableKnob.styles.css";
import { turnable as turnableClass } from "@utils/classes/knob/Turnable";

interface Props extends KnobBaseProps {
    min: number;
    max: number;
    step?: number;
    onTurn: (currentValue: number) => void;
}

function TurnableKnob(props: Props) {
    const { min, max, step = 1, name, onTurn, disabled } = props;

    const [currentValue, setCurrentValue] = createSignal<number>(0);

    createEffect(() => {
        onTurn(currentValue());
    });

    if (min >= max)
        throw new Error(
            "The minimum value must be less than the maximum value"
        );

    return (
        <KnobBase
            id="turnableKnob"
            class={turnableClass}
            knobType="turnable"
            name={name}
            disabled={disabled}
            min={min}
            max={max}
            step={4}
            value={currentValue()}
        >
            <div class="border-2 border-white h-7 mt-[-2rem]" />
        </KnobBase>
    );
}

export default TurnableKnob;

import {
    createMemo,
    createSignal,
    createEffect,
    createRenderEffect,
} from "solid-js";
import KnobBase from "../KnobBase";
import type { KnobBaseProps } from "@interfaces/KnobBaseProps";

import "./TurnableKnob.styles.css";
import { closest } from "@utils/closest";

const angles = {
    min: -135,
    max: 135,
};

interface Props extends KnobBaseProps {
    min: number;
    max: number;
    onTurn: (currentValue: number) => void;
}

function TurnableKnob(props: Props) {
    let knobIndicatorRef: HTMLDivElement;

    const { min, max, name, onTurn, disabled } = props;

    const [currentValue, setCurrentValue] = createSignal<number>(0);
    const [currentKnobIndicatorAngle, setCurrentKnobIndicatorAngle] =
        createSignal<number>(0);

    const numSteps = createMemo(() => Math.abs(min) + max);
    const angleStep = createMemo(() => (angles.max - angles.min) / numSteps());
    const positionStep = createMemo(
        () => (clientBoundaries: { upper: number; lower: number }) =>
            (clientBoundaries.upper - clientBoundaries.lower) / numSteps()
    );

    const possibilities = createMemo(
        () => (clientBoundaries: { upper: number; lower: number }) => {
            const possibleAngles = [];
            const possiblePositions = [];
            const possibleValues = [];

            const positionStepToCompute = positionStep();

            for (let i = 0; i < numSteps() + 1; i++) {
                possibleAngles.push(angles.min + i * angleStep());
                possiblePositions.push(
                    clientBoundaries.lower +
                        i * positionStepToCompute(clientBoundaries)
                );
                possibleValues.push(min + i);
            }

            return { possibleAngles, possiblePositions, possibleValues };
        }
    );

    const dragHandler = (
        event: DragEvent & {
            currentTarget: HTMLDivElement;
            target: Element;
        }
    ) => {
        event.preventDefault();
        const currentPosition = event.x;

        if (currentPosition === 0) return;

        const { left: lower, right: upper } =
            event.target.getBoundingClientRect();

        const possibilitiesToCompute = possibilities();
        const { possiblePositions, possibleAngles, possibleValues } =
            possibilitiesToCompute({ lower, upper });

        const { diff: closestPosition, index: closestPositionIndex } = closest({
            from: possiblePositions,
            target: currentPosition,
        });

        const newAngle = possibleAngles[closestPositionIndex];

        if (currentValue() !== possibleValues[closestPositionIndex]) {
            const newValue = possibleValues[closestPositionIndex];
            if (newValue) setCurrentValue(newValue);
        }

        if (newAngle) setCurrentKnobIndicatorAngle(newAngle);
    };

    createEffect(() => {
        onTurn(currentValue());
    });

    createEffect(() => {
        if (knobIndicatorRef)
            knobIndicatorRef.style.transform = `rotate(${currentKnobIndicatorAngle()}deg)`;
    });

    if (min >= max)
        throw new Error(
            "The minimum value must be less than the maximum value"
        );

    return (
        <KnobBase
            id="turnableKnob"
            name={name}
            disabled={disabled}
            class={`relative ${disabled ? "pointer-events-none" : ""}`}
            draggable
            onDragStart={(event) => {
                event.dataTransfer?.setDragImage(new Image(), 10, 10);
            }}
            onDragEnd={(event) => event.stopImmediatePropagation()}
            onDrag={disabled ? () => {} : dragHandler}
        >
            <div
                ref={(element) => (knobIndicatorRef = element)}
                class="border-2 border-white h-7 mt-[-2rem] transform origin-bottom"
            />
            <div class="flex justify-center -translate-x-[0.2rem] translate-y-5">
                <p class="absolute select-none text-base -translate-x-12">
                    {min}
                </p>
                <p class="absolute select-none text-base translate-x-12">
                    {max}
                </p>
            </div>
        </KnobBase>
    );
}

export default TurnableKnob;

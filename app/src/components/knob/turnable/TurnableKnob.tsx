import { createMemo, createSignal, createEffect, onMount } from "solid-js";
import KnobBase from "../KnobBase";
import type { KnobBaseProps } from "@/interfaces/KnobBaseProps";

import { store, setStore } from "@/store/store";

import "./TurnableKnob.styles.css";
import { closest } from "@/utils/closest";

const angles = {
    min: -135,
    max: 135,
};

interface Boundaries {
    upper: number;
    lower: number;
}
interface Props extends KnobBaseProps {
    min: number;
    max: number;
    defaultKnobPosition?: "start" | "middle";
    onTurn: (currentValue: number) => void;
}

function TurnableKnob(props: Props) {
    let knobIndicatorRef: HTMLDivElement;
    let knobRef: HTMLDivElement;

    const {
        min,
        max,
        defaultKnobPosition = "start",
        name,
        onTurn,
        disabled,
    } = props;

    const [currentKnobIndicatorAngle, setCurrentKnobIndicatorAngle] =
        createSignal<number>(0);

    const numSteps = createMemo(() => Math.abs(min) + max);
    const angleStep = createMemo(() => (angles.max - angles.min) / numSteps());

    const positionStep = createMemo(
        () => (clientBoundaries: Boundaries) =>
            (clientBoundaries.upper - clientBoundaries.lower) / numSteps()
    );

    const possibilities = createMemo(() => (clientBoundaries: Boundaries) => {
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
    });

    const turnKnob = ({
        knobPosition,
        boundaries,
    }: {
        knobPosition: number;
        boundaries: Boundaries;
    }) => {
        if (knobPosition === 0) return;
        const { lower, upper } = boundaries;

        const possibilitiesToCompute = possibilities();
        const { possiblePositions, possibleAngles, possibleValues } =
            possibilitiesToCompute({ lower, upper });

        const { diff: closestPosition, index: closestPositionIndex } = closest({
            from: possiblePositions,
            target: knobPosition,
        });

        const newAngle = possibleAngles[closestPositionIndex];

        if (
            (store()[name].value as number) !==
            possibleValues[closestPositionIndex]
        ) {
            const newValue = possibleValues[closestPositionIndex];
            if (newValue)
                setStore((state) => ({
                    ...state,
                    [name]: { value: newValue },
                }));
        }

        if (newAngle) setCurrentKnobIndicatorAngle(newAngle);
    };

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

        turnKnob({
            knobPosition: currentPosition,
            boundaries: { lower, upper },
        });
    };

    createEffect(() => {
        onTurn(store()[name].value as number);
    });

    createEffect(() => {
        if (knobIndicatorRef)
            knobIndicatorRef.style.transform = `rotate(${currentKnobIndicatorAngle()}deg)`;
    });
    onMount(() => {
        if (knobRef) {
            const { left: lower, right: upper } =
                knobRef.getBoundingClientRect();

            const knobPosition = (() => {
                if (defaultKnobPosition === "start") return lower;
                return (lower + upper) / 2;
            })();

            turnKnob({ knobPosition, boundaries: { lower, upper } });
        }
    });

    if (min >= max)
        throw new Error(
            "The minimum value must be less than the maximum value"
        );

    return (
        <KnobBase
            id="turnableKnob"
            ref={(element) => (knobRef = element)}
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

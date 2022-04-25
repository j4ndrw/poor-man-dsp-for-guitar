import { ellipse as ellipseClass } from "@utils/classes/knob/Ellipse";
import { turnable as turnableClass } from "@utils/classes/knob/Turnable";
import { clickable as clickableClass } from "@utils/classes/knob/Clickable";
import { JSX, Match, PropsWithChildren, Switch } from "solid-js";
import type { KnobBaseProps } from "@interfaces/KnobBaseProps";

function KnobBase(
    props: KnobBaseProps &
        JSX.InputHTMLAttributes<HTMLInputElement> & {
            knobType: "clickable" | "turnable";
        }
) {
    const { disabled, name, knobType, ...knobProps } = props;

    const disabledClass = disabled
        ? "opacity-50"
        : "hover:opacity-50 cursor-pointer";

    return (
        <div class={`w-[15%] flex flex-col justify-center items-center`}>
            <label class={`${disabledClass} relative`}>
                <input
                    class={`appearance-none outline-none transition-opacity duration-200 bg-transparent ${ellipseClass} ${knobProps.class}`}
                    type={knobType === "turnable" ? "range" : "button"}
                    {...knobProps}
                />
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[65%]">
                    <Switch>
                        <Match when={knobType === "clickable"}>
                            <div class={clickableClass} />
                        </Match>
                        <Match when={knobType === "turnable"}>
                            <div class="transform translate-y-[1.75rem] flex justify-between">
                                <p class="select-none text-lg -translate-x-10">
                                    {knobProps.min}
                                </p>
                                <p class="select-none text-lg translate-x-10">
                                    {knobProps.max}
                                </p>
                            </div>
                        </Match>
                    </Switch>
                </div>
            </label>
            <p class="text-lg select-none -translate-y-2">{name}</p>
        </div>
    );
}
export default KnobBase;

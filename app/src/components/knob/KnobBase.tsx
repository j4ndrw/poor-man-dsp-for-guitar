import { ellipse as ellipseClass } from "@/utils/classes/knob/Ellipse";
import type { JSX, PropsWithChildren } from "solid-js";
import type { KnobBaseProps } from "@/interfaces/KnobBaseProps";

function KnobBase(
    props: PropsWithChildren<KnobBaseProps & JSX.HTMLAttributes<HTMLDivElement>>
) {
    const { children, disabled, name, ...knobProps } = props;

    const disabledClass = disabled
        ? "opacity-50"
        : "hover:opacity-50 cursor-pointer";

    return (
        <div class="flex flex-col justify-center items-center">
            <div
                {...knobProps}
                class={`${disabledClass} ${ellipseClass} flex justify-center items-center ${knobProps.class}`}
            >
                {children}
            </div>
            <p class={`${disabled ? "opacity-50" : ""} text-lg select-none`}>
                {name}
            </p>
        </div>
    );
}
export default KnobBase;

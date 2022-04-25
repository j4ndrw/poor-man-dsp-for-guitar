import KnobBase from "../KnobBase";
import type { KnobBaseProps } from "@interfaces/KnobBaseProps";
import { clickable as clickableClass } from "@utils/classes/knob/Clickable";

interface Props extends KnobBaseProps {
    onClick?: (
        event: MouseEvent & {
            currentTarget: HTMLDivElement;
            target: Element;
        }
    ) => void;
}

function ClickableKnob(props: Props) {
    const { disabled, name, onClick } = props;

    return (
        <KnobBase
            name={name}
            disabled={disabled}
            onClick={disabled ? () => {} : onClick}
        >
            <div class={clickableClass} />
        </KnobBase>
    );
}

export default ClickableKnob;

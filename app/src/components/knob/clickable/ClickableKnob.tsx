import KnobBase from "../KnobBase";
import type { KnobBaseProps } from "@/interfaces/KnobBaseProps";
import { clickable as clickableClass } from "@/utils/classes/knob/Clickable";
import { store, setStore } from "@/store/store";

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
            onClick={
                disabled
                    ? () => {}
                    : (event) => {
                          if (onClick) onClick(event);
                          setStore((state) => ({
                              ...state,
                              [name]: { value: !store()[name].value },
                          }));
                      }
            }
        >
            <div
                class={`${clickableClass} ${
                    store()[name].value ? "bg-white" : ""
                }`}
            />
        </KnobBase>
    );
}

export default ClickableKnob;

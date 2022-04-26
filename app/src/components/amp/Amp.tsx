import { createAmp } from "@/hooks/amp/createAmp";
import { For } from "solid-js";

interface Props {
    disabled?: boolean;
}

function Amp(props: Props) {
    const { disabled } = props;

    const ampKnobs = createAmp();

    return (
        <div class="fixed bottom-4 min-w-full py-4 grid place-items-center xl:grid-cols-9 grid-cols-3">
            <For each={ampKnobs({ disabled })}>{(Knob) => <Knob />}</For>
        </div>
    );
}

export default Amp;

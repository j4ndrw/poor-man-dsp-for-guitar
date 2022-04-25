import { createAmp } from "@/hooks/amp/createAmp";
import { For } from "solid-js";

interface Props {
    disabled?: boolean;
}

function Amp(props: Props) {
    const { disabled } = props;

    const ampKnobs = createAmp();

    return (
        <div class="fixed bottom-4 left-[275px] right-[275px] border-8 py-4 w-auto border-white rounded-3xl flex justify-center items-center xl:flex-row">
            <For each={ampKnobs({ disabled })}>
                {(Knob) => (
                    <div class="scale-90 px-4 transform translate-x-6">
                        <Knob />
                    </div>
                )}
            </For>
        </div>
    );
}

export default Amp;

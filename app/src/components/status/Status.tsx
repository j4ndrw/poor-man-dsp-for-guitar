import { store } from "@/store/store";
import { For } from "solid-js";
import { effectNames } from "@/types/AmpSettings";

function Status() {
    return (
        <div class="fixed right-5 top-52 border-[6px] w-96 border-white/20 rounded-3xl p-8">
            <For each={effectNames}>
                {(effect) => {
                    return (
                        <div class="flex gap-16 justify-between">
                            <p class="font-bold">{effect}</p>
                            <p>
                                {typeof store()[effect].value === "boolean"
                                    ? store()[effect].value
                                        ? "On"
                                        : "Off"
                                    : `${store()[effect].value}%`}
                            </p>
                        </div>
                    );
                }}
            </For>
        </div>
    );
}

export default Status;

import { initialStoreState, setStore, store } from "@/store/store";
import { createMemo, For } from "solid-js";
import { effectNames } from "@/types/AmpSettings";

function Status() {
    const microphone = createMemo(() => store().audio!.microphone);

    return (
        <div class="fixed right-5 top-52 border-[6px] w-96 border-white/20 rounded-3xl p-8">
            <div class="flex flex-col absolute -bottom-28 right-10 gap-2 transform translate-y-1">
                <button
                    class="bg-neutral-800 hover:bg-neutral-700 text-gray-200 font-bold py-2 px-4 inline-flex items-center rounded-2xl"
                    onClick={() => {
                        microphone().mediaStream.getAudioTracks()[0].enabled =
                            !microphone().mediaStream.getAudioTracks()[0]
                                .enabled;
                    }}
                >
                    Mute Microphone
                </button>
                <button
                    class="bg-neutral-800 hover:bg-neutral-700 text-gray-200 font-bold py-2 px-4 inline-flex items-center rounded-2xl"
                    onClick={() => {
                        setStore(() => ({
                            ...initialStoreState,
                            audio: store().audio,
                        }));
                    }}
                >
                    Reset Effects to Default
                </button>
            </div>
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

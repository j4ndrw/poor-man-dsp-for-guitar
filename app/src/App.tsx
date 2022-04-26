import Amp from "@/components/amp/Amp";
import { Component, Match, onMount, Switch } from "solid-js";
import Status from "@/components/status/Status";
import { setStore, store } from "@/store/store";
import MicrophonePlayback from "@/components/audio/MicrophonePlayback";

const App: Component = () => {
    onMount(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((audioDevice) => {
                setStore((state) => ({
                    ...state,
                    audioDevice,
                }));
            });
    });

    return (
        <div class="flex flex-col justify-center items-center">
            <h1 class="m-16 text-center text-6xl select-none">
                Poor Man's DSP
            </h1>
            <Switch
                fallback={
                    <h1 class="text-4xl text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Please connect your input (e.g. Microphone) and output
                        (e.g. Speaker) devices.
                    </h1>
                }
            >
                <Match when={store().audioDevice !== null}>
                    <MicrophonePlayback />
                    <Amp />
                    <Status />
                </Match>
            </Switch>
        </div>
    );
};

export default App;

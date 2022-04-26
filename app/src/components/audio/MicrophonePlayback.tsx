// Credit: https://github.com/cleandersonlobo/react-mic/blob/master/src/libs/AudioContext.js

import { store } from "@/store/store";
import { Sampler } from "@/utils/dsp/sampler";
import { createEffect, createSignal, onMount } from "solid-js";

function MicrophonePlayback() {
    let audioRef: HTMLAudioElement;

    onMount(() => {
        if (!audioRef) return;
        if (audioRef.src || audioRef.srcObject) return;
        if (!store().audioDevice) return;

        // Credit: https://www.geeksforgeeks.org/how-to-record-and-play-audio-in-javascript/
        audioRef.load();
        if ("srcObject" in audioRef) audioRef.srcObject = store().audioDevice;
        else
            audioRef.src = window.URL.createObjectURL(
                store().audioDevice! as unknown as MediaSource
            );

        audioRef.onloadedmetadata = (event) => {
            audioRef.play();
        };
    });

    createEffect(() => {
        if (!audioRef) return;
        audioRef.volume = store().Volume.value / 100;
    });

    return (
        <div>
            <audio preload="auto" ref={(element) => (audioRef = element)} />
        </div>
    );
}

export default MicrophonePlayback;

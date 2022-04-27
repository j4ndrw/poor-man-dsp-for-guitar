import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

function createGain() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const gainNode = audioContext().createGain();

    onMount(() => {
        // Connect microphone to gain node
        microphone().connect(gainNode);

        // Connect gain node to main audio context
        gainNode.connect(audioContext().destination);
    });

    createEffect(() => {
        // Credit: https://stackoverflow.com/questions/33129754/volume-control-with-web-audio-api
        if (store().Chorus.value) gainNode.gain.value = 0;
        else gainNode.gain.value = store().Gain.value / 12;
    });
}

export default createGain;

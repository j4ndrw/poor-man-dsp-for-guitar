import { store } from "@/store/store";
import { createEffect, on, onMount } from "solid-js";

function createGain() {
    const gainNode = store().audio!.microphone.context.createGain();

    onMount(() => {
        gainNode.connect(store().audio!.microphone.context.destination);
        store().audio!.microphone.connect(gainNode);
    });

    createEffect(() => {
        // Credit: https://stackoverflow.com/questions/33129754/volume-control-with-web-audio-api

        gainNode.gain.value = store().Gain.value;
    });
}

export default createGain;

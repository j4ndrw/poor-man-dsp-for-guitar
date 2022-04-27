import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

function createGain({ masterNode }: { masterNode: AudioNode }) {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const gainNode = audioContext().createGain();

    onMount(() => {
        // Connect microphone to the master node
        microphone().connect(masterNode);

        // Connect the master node to the gain node
        masterNode.connect(gainNode);

        // Connect gain node to main audio context
        gainNode.connect(audioContext().destination);
    });

    createEffect(() => {
        // Credit: https://stackoverflow.com/questions/33129754/volume-control-with-web-audio-api
        if (store().Chorus.value) gainNode.gain.value = 0;
        else gainNode.gain.value = (store().Gain.value * 2) / 100;
    });

    return { gainNode };
}

export default createGain;

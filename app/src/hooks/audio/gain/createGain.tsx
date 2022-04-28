import { store } from "@/store/store";
import { Accessor, createEffect, createMemo, onMount } from "solid-js";

function createGain() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const gainNode = createMemo(() => audioContext().createGain());

    createEffect(() => {
        // Credit: https://stackoverflow.com/questions/33129754/volume-control-with-web-audio-api

        gainNode().gain.setTargetAtTime(
            (store().Gain.value / 100) * 2,
            microphone().context.currentTime,
            0.01
        );
    });

    return { gainNode };
}

export default createGain;

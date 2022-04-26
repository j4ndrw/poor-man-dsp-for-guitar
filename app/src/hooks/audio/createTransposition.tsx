import { store } from "@/store/store";
import { createEffect, onMount } from "solid-js";

// @ts-ignore
import * as PitchShift from "soundbank-pitch-shift";

function createTransposition() {
    const pitchShiftNode = PitchShift(store().audio!.microphone.context);

    onMount(() => {
        store().audio!.microphone.connect(pitchShiftNode);
    });

    createEffect(() => {
        // Credit: https://stackoverflow.com/questions/33129754/volume-control-with-web-audio-api

        pitchShiftNode.transpose = store().Transpose.value;
        pitchShiftNode.wet.value = 1;
        pitchShiftNode.dry.value = 0.5;
    });
}

export default createTransposition;

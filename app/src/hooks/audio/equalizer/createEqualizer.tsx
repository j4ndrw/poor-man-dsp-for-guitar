import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

// Credit:
//      https://stackoverflow.com/questions/30065093/web-audio-api-equalizer
//      https://stackoverflow.com/questions/29110380/web-audio-api-setting-treble-and-bass

function createEqualizer(...otherNodes: AudioNode[]) {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const lowsFilter = audioContext().createBiquadFilter();
    const midsFilter = audioContext().createBiquadFilter();
    const highsFilter = audioContext().createBiquadFilter();

    onMount(() => {
        // Connect microphone to the filters
        microphone().connect(lowsFilter);
        microphone().connect(midsFilter);
        microphone().connect(highsFilter);

        // Connect the other nodes to the filters
        otherNodes.forEach((node) => {
            node.connect(lowsFilter);
            node.connect(midsFilter);
            node.connect(highsFilter);
        });

        // Connect the filters to main audio context
        lowsFilter.connect(audioContext().destination);
        midsFilter.connect(audioContext().destination);
        highsFilter.connect(audioContext().destination);
    });

    createEffect(() => {
        lowsFilter.type = "lowshelf";
        midsFilter.type = "peaking";
        highsFilter.type = "highshelf";

        lowsFilter.frequency.value = 400 + store().Low.value;
        midsFilter.frequency.value = 2200 + store().Mid.value;
        highsFilter.frequency.value = 4000 + store().High.value;

        lowsFilter.gain.value = (store().Low.value - 50) / 2;
        midsFilter.gain.value = (store().Mid.value - 50) / 1.5;
        highsFilter.gain.value = (store().High.value - 50) / 1.3;
    });
}

export default createEqualizer;

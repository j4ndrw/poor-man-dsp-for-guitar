import { store } from "@/store/store";
import { createEffect, createMemo } from "solid-js";

function createReverb({ masterNode }: { masterNode: AudioNode }) {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const reverbNode = audioContext().createConvolver();

    const shouldReverb = createMemo(() => store().Reverb.value);

    createEffect(() => {
        if (!shouldReverb()) {
            reverbNode.disconnect();
            return;
        }

        // Connect microphone to master node
        microphone().connect(masterNode);

        // Connect master node to reverb node
        masterNode.connect(reverbNode);

        // Connect reverb node to audio context
        reverbNode.connect(audioContext().destination);
    });
}

export default createReverb;

import createGain from "@/hooks/audio/gain/createGain";
import createChorus from "@/hooks/audio/chorus/createChorus";
import createDistortion from "@/hooks/audio/distortion/createDistortion";
import createEqualizer from "@/hooks/audio/equalizer/createEqualizer";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { store } from "@/store/store";

function MicrophonePlayback() {
    let canvasRef: HTMLCanvasElement;
    let waveformDivRef: HTMLDivElement;

    const masterNode = store().audio!.context.createGain();
    const analyser = createMemo(() => store().audio!.analyser);
    const { gainNode } = createGain({ masterNode });
    const { chorusNode } = createChorus({ masterNode });
    const { distortionWaveShaperNode } = createDistortion({ masterNode });
    createEqualizer({
        masterNode,
        otherNodes: [gainNode, chorusNode, distortionWaveShaperNode],
    });

    const [waveData, setWaveData] = createSignal<Uint8Array>();
    const [drawingStarted, setDrawingStarted] = createSignal<boolean>(false);

    onMount(() => {
        analyser().connect(masterNode);
    });

    createEffect(() => {
        // Credit: https://github.com/agiratech/picth-liveinput/blob/master/lib/pitchdetect.js

        if (!canvasRef) return;
        analyser().fftSize = 128;

        const bufferLength = analyser().frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);
        setWaveData(dataArray);
    });

    createEffect(() => {
        if (!canvasRef) return;
        if (!waveData()) return;
        if (drawingStarted()) return;
        setDrawingStarted(true);

        const canvasContext = canvasRef.getContext("2d");

        if (!canvasContext) return;

        canvasContext.clearRect(
            0,
            0,
            waveformDivRef.clientWidth,
            waveformDivRef.clientHeight
        );
        canvasContext.strokeStyle = "white";

        const drawFunc = () => {
            requestAnimationFrame(drawFunc);

            analyser().getByteTimeDomainData(waveData()!);

            canvasContext.clearRect(
                0,
                0,
                waveformDivRef.clientWidth,
                waveformDivRef.clientHeight
            );

            canvasContext.lineWidth = 4;
            canvasContext.strokeStyle = "rgb(255, 255, 255)";
            canvasContext.beginPath();

            let sliceWidth =
                waveformDivRef.clientWidth / analyser().frequencyBinCount;
            let x = 0;
            for (let i = 0; i < analyser().frequencyBinCount; i++) {
                let v = waveData()![i] / 128.0;
                let y = (v * waveformDivRef.clientHeight) / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }
            canvasContext.lineTo(canvasRef.width, (canvasRef.height + 30) / 2);
            canvasContext.stroke();
        };
        drawFunc();
    });

    return (
        <div
            ref={(element) => (waveformDivRef = element)}
            class="absolute bottom-32 left-1/2 transform -translate-x-1/2"
        >
            <canvas
                ref={(element) => (canvasRef = element)}
                width="2200px"
                height="300px"
            />
        </div>
    );
}

export default MicrophonePlayback;

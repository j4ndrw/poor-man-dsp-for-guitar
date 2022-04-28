import createGain from "@/hooks/audio/gain/createGain";
import createChorus from "@/hooks/audio/chorus/createChorus";
import createDistortion from "@/hooks/audio/distortion/createDistortion";
import createEqualizer from "@/hooks/audio/equalizer/createEqualizer";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { initialStoreState, setStore, store } from "@/store/store";
import createReverb from "@/hooks/audio/reverb/createReverb";

function MicrophonePlayback() {
    let canvasRef: HTMLCanvasElement;
    let waveformDivRef: HTMLDivElement;

    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);
    const analyserNode = createMemo(() => store().audio!.analyser);
    const masterNode = createMemo(() => store().audio!.context.createGain());

    const { gainNode } = createGain();
    const { chorusNode } = createChorus();
    const { distortionNode } = createDistortion();
    const { reverbNode } = createReverb();

    const { equalizerNode } = createEqualizer();

    const [waveData, setWaveData] = createSignal<Uint8Array>();
    const [drawingStarted, setDrawingStarted] = createSignal<boolean>(false);

    const connectNodes = ({
        from,
        to,
    }: {
        from: AudioNode;
        to: AudioNode[];
    }) => {
        to.forEach((node) => {
            from.connect(node).connect(audioContext().destination);
        });
    };

    onMount(async () => {
        if (audioContext().state === "suspended") {
            await audioContext().resume();
        }

        // Connect microphone to analyser and the the master node
        connectNodes({
            from: microphone(),
            to: [analyserNode(), masterNode()],
        });

        // Connect the analyse to the master node
        connectNodes({
            from: analyserNode(),
            to: [masterNode()],
        });

        // Connect the master node to all the effects
        connectNodes({
            from: masterNode(),
            to: [
                gainNode(),
                chorusNode(),
                distortionNode(),
                reverbNode(),
                equalizerNode(),
            ],
        });

        // Connect the gain node to the other effects
        connectNodes({
            from: gainNode(),
            to: [chorusNode(), distortionNode(), reverbNode(), equalizerNode()],
        });
    });

    createEffect(() => []);

    createEffect(() => {
        // Credit: https://github.com/agiratech/picth-liveinput/blob/master/lib/pitchdetect.js

        if (!canvasRef) return;
        analyserNode().fftSize = 128;

        const bufferLength = analyserNode().frequencyBinCount;

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

            analyserNode().getByteTimeDomainData(waveData()!);

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
                waveformDivRef.clientWidth / analyserNode().frequencyBinCount;
            let x = 0;
            for (let i = 0; i < analyserNode().frequencyBinCount; i++) {
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
        <div>
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
        </div>
    );
}

export default MicrophonePlayback;

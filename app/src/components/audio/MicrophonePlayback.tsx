import createGain from "@/hooks/audio/gain/createGain";
import createChorus from "@/hooks/audio/chorus/createChorus";

function MicrophonePlayback() {
    let canvasRef: HTMLCanvasElement;

    createGain();
    createChorus();

    return <canvas ref={(element) => (canvasRef = element)} />;
}

export default MicrophonePlayback;

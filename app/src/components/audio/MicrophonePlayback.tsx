import createGain from "@/hooks/audio/gain/createGain";
import createChorus from "@/hooks/audio/chorus/createChorus";
import createDistortion from "@/hooks/audio/distortion/createDistortion";

function MicrophonePlayback() {
    let canvasRef: HTMLCanvasElement;

    createGain();
    createChorus();
    createDistortion();

    return <canvas ref={(element) => (canvasRef = element)} />;
}

export default MicrophonePlayback;

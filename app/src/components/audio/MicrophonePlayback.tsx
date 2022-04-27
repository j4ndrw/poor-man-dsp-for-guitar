import createGain from "@/hooks/audio/gain/createGain";
import createChorus from "@/hooks/audio/chorus/createChorus";
import createDistortion from "@/hooks/audio/distortion/createDistortion";
import createEqualizer from "@/hooks/audio/equalizer/createEqualizer";

function MicrophonePlayback() {
    let canvasRef: HTMLCanvasElement;

    const { gainNode } = createGain();
    const { chorusNode } = createChorus();
    const { distortionWaveShaperNode } = createDistortion();
    createEqualizer(gainNode, chorusNode, distortionWaveShaperNode);

    return <canvas ref={(element) => (canvasRef = element)} />;
}

export default MicrophonePlayback;

import dspConstants from "@/utils/dsp/constants";

export const invert = (buffer: Float64Array) => {
    for (let i = 0, len = buffer.length; i < len; i++) {
        buffer[i] *= -1;
    }

    return buffer;
};

export const interleave = (left: Float64Array, right: Float64Array) => {
    if (left.length !== right.length) {
        throw "Can not interleave. Channel lengths differ.";
    }

    let stereoInterleaved = new Float64Array(left.length * 2);

    for (let i = 0, len = left.length; i < len; i++) {
        stereoInterleaved[2 * i] = left[i];
        stereoInterleaved[2 * i + 1] = right[i];
    }

    return stereoInterleaved;
};

export const deinterleave = (() => {
    let left: Float64Array;
    let right: Float64Array;
    let mix: Float64Array;
    let deinterleaveChannel: ((buffer: Float64Array) => Float64Array)[] = [];

    deinterleaveChannel[dspConstants.channels.MIX] = (buffer) => {
        for (let i = 0, len = buffer.length / 2; i < len; i++) {
            mix[i] = (buffer[2 * i] + buffer[2 * i + 1]) / 2;
        }
        return mix;
    };

    deinterleaveChannel[dspConstants.channels.LEFT] = (buffer) => {
        for (let i = 0, len = buffer.length / 2; i < len; i++) {
            left[i] = buffer[2 * i];
        }
        return left;
    };

    deinterleaveChannel[dspConstants.channels.RIGHT] = (buffer) => {
        for (let i = 0, len = buffer.length / 2; i < len; i++) {
            right[i] = buffer[2 * i + 1];
        }
        return right;
    };

    return (channel: number, buffer: Float64Array) => {
        left = left || new Float64Array(buffer.length / 2);
        right = right || new Float64Array(buffer.length / 2);
        mix = mix || new Float64Array(buffer.length / 2);

        if (buffer.length / 2 !== left.length) {
            left = new Float64Array(buffer.length / 2);
            right = new Float64Array(buffer.length / 2);
            mix = new Float64Array(buffer.length / 2);
        }

        return deinterleaveChannel[channel](buffer);
    };
})();

export const getChannel = deinterleave;

export const mixSampleBuffers = (
    sampleBuffer1: Float64Array,
    sampleBuffer2: Float64Array,
    negate: boolean,
    volumeCorrection: number
) => {
    let outputSamples = new Float64Array(sampleBuffer1);

    for (let i = 0; i < sampleBuffer1.length; i++) {
        outputSamples[i] +=
            (negate ? -sampleBuffer2[i] : sampleBuffer2[i]) / volumeCorrection;
    }

    return outputSamples;
};

export const RMS = (buffer: Float64Array) => {
    let total = 0;
    for (let i = 0; i < buffer.length; i++) {
        total += buffer[i] * buffer[i];
    }
    return Math.sqrt(total / buffer.length);
};

export const peak = (buffer: Float64Array) => {
    let peak = 0;
    for (let i = 0; i < buffer.length; i++) {
        peak = Math.abs(buffer[i]) > peak ? Math.abs(buffer[i]) : peak;
    }
    return peak;
};

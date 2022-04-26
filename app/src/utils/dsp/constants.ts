export default {
    channels: {
        LEFT: 0,
        RIGHT: 1,
        MIX: 2,
    },

    waveforms: {
        SINE: 1,
        TRIANGLE: 2,
        SAW: 3,
        SQUARE: 4,
    },

    filters: {
        LOWPASS: 0,
        HIGHPASS: 1,
        BANDPASS: 2,
        NOTCH: 3,
    },

    windowFunctions: {
        BARTLETT: 1,
        BARTLETTHANN: 2,
        BLACKMAN: 3,
        COSINE: 4,
        GAUSS: 5,
        HAMMING: 6,
        HANN: 7,
        LANCZOS: 8,
        RECTANGULAR: 9,
        TRIANGULAR: 10,
    },

    loopModes: {
        OFF: 0,
        FW: 1,
        BW: 2,
        FWBW: 3,
    },

    math: {
        TWO_PI: 2 * Math.PI,
    },

    biquadFilterTypes: {
        LPF: 0, // H(s) = 1 / (s^2 + s/Q + 1)
        HPF: 1, // H(s) = s^2 / (s^2 + s/Q + 1)
        BPF_CONSTANT_SKIRT: 2, // H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q)
        BPF_CONSTANT_PEAK: 3, // H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
        NOTCH: 4, // H(s) = (s^2 + 1) / (s^2 + s/Q + 1)
        APF: 5, // H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)
        PEAKING_EQ: 6, // H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
        LOW_SHELF: 7, // H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)
        HIGH_SHELF: 8, // H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
    },

    biquadFilterParameterTypes: {
        Q: 1,
        BW: 2,
        S: 3,
    },
};
